#!/usr/bin/env python3
"""
Aura ERP — Stress-test seeder
Populates the database with a large realistic dataset.

Usage:
    python seed_stress.py

Requires: psycopg2-binary
    pip install psycopg2-binary
"""

import random
import string
import psycopg2
from psycopg2.extras import execute_values
from datetime import date, timedelta

# ── Connection ────────────────────────────────────────────────────────────────
DB = dict(
    host="localhost",
    port=5433,          # mapped host port from docker-compose
    dbname="crud_db",
    user="myuser",
    password="mypassword",
)

# ── Counts ────────────────────────────────────────────────────────────────────
N_USERS      = 5_000
N_CLIENTS    = 2_000
N_PRODUCTS   = 500
N_PROPOSALS  = 100_000
N_ORDERS     = 200
BATCH        = 2_000   # rows per INSERT

# ── Helpers ───────────────────────────────────────────────────────────────────
ROLES      = ["admin", "sales", "production", "viewer"]
PROP_STATI = ["draft", "pending", "approved", "rejected"]
ORD_STATI  = ["pending", "in_production", "completed", "delivered"]
UNITS      = ["m2", "m", "kg", "un", "l", "box"]
CITIES     = ["Porto", "Lisboa", "Braga", "Faro", "Coimbra",
              "Aveiro", "Setúbal", "Viseu", "Évora", "Leiria"]
FIRST      = ["Ana","João","Carlos","Maria","Pedro","Sofia",
              "Rui","Inês","Miguel","Beatriz","André","Catarina"]
LAST       = ["Silva","Santos","Ferreira","Costa","Oliveira",
              "Sousa","Rodrigues","Martins","Pereira","Alves"]

PASSWORD_HASH = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"  # sha256("password123")

def rand_name():
    return f"{random.choice(FIRST)} {random.choice(LAST)}"

def rand_date(start_year=2022, end_year=2025):
    start = date(start_year, 1, 1)
    end   = date(end_year, 12, 31)
    return start + timedelta(days=random.randint(0, (end - start).days))

def batched(iterable, n):
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) == n:
            yield batch
            batch = []
    if batch:
        yield batch

def insert_batched(cur, sql, rows, batch_size=BATCH):
    total = 0
    for chunk in batched(rows, batch_size):
        execute_values(cur, sql, chunk, page_size=batch_size)
        total += len(chunk)
    return total

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    conn = psycopg2.connect(**DB)
    conn.autocommit = False
    cur  = conn.cursor()

    print("Connected. Starting seed...\n")

    # ── Users ────────────────────────────────────────────────────────────────
    print(f"Inserting {N_USERS:,} users...")
    user_rows = [
        (
            rand_name(),
            f"user{i}@stress.test",
            PASSWORD_HASH,
            random.choice(ROLES),
        )
        for i in range(1, N_USERS + 1)
    ]
    n = insert_batched(cur,
        "INSERT INTO users (name, email, password_hash, role) VALUES %s ON CONFLICT DO NOTHING",
        user_rows)
    print(f"  → {n:,} users inserted")

    # Fetch all user IDs (including pre-existing ones)
    cur.execute("SELECT id FROM users")
    user_ids = [r[0] for r in cur.fetchall()]

    # ── Clients ──────────────────────────────────────────────────────────────
    print(f"Inserting {N_CLIENTS:,} clients...")
    client_rows = [
        (
            f"{random.choice(['ACME','Globex','Initech','Umbrella','Stark','Wayne','Oscorp','Dunder'])} {rand_name()} Ltd",
            f"contact{i}@client{i}.com",
            f"+351 9{''.join(random.choices(string.digits, k=8))}",
            f"Rua {rand_name()} {random.randint(1,999)}, {random.choice(CITIES)}",
            f"PT{''.join(random.choices(string.digits, k=9))}",
            random.choice([None, None, None, "VIP", "Priority account", "Net-30 terms"]),
        )
        for i in range(1, N_CLIENTS + 1)
    ]
    n = insert_batched(cur,
        "INSERT INTO clients (name, email, phone, address, vat_number, notes) VALUES %s",
        client_rows)
    print(f"  → {n:,} clients inserted")

    cur.execute("SELECT id FROM clients")
    client_ids = [r[0] for r in cur.fetchall()]

    # ── Sections ─────────────────────────────────────────────────────────────
    print("Inserting sections (idempotent)...")
    section_rows = [
        ("Metalwork",   "Metal cutting, bending and welding"),
        ("Painting",    "Surface treatment and powder coating"),
        ("Assembly",    "Final assembly and quality control"),
        ("Carpentry",   "Wood framing and finishing"),
        ("Electrical",  "Wiring and panel installation"),
        ("Hydraulics",  "Pipe fitting and hydraulic systems"),
        ("Logistics",   "Packaging and outbound shipping"),
        ("Engineering", "Design, drafting and prototyping"),
        ("Maintenance", "Preventive and corrective maintenance"),
        ("Purchasing",  "Procurement and supplier management"),
    ]
    execute_values(cur,
        "INSERT INTO sections (name, description) VALUES %s ON CONFLICT DO NOTHING",
        section_rows)

    cur.execute("SELECT id FROM sections")
    section_ids = [r[0] for r in cur.fetchall()]
    print(f"  → {len(section_ids)} sections available")

    # ── Products ─────────────────────────────────────────────────────────────
    print(f"Inserting {N_PRODUCTS:,} products...")
    PRODUCT_TEMPLATES = [
        ("Steel Sheet {t}mm",       "Cold-rolled steel sheet {t}mm thick",  "m2"),
        ("Steel Tube {t}x{t}",      "Square hollow section {t}x{t}",        "m"),
        ("Aluminium Profile {t}",   "Extruded aluminium profile series {t}", "m"),
        ("Paint Primer {t}",        "Epoxy primer coat type {t}",            "kg"),
        ("Bolt Set M{t}",           "Hex bolt set M{t} DIN933",              "un"),
        ("Wire Roll {t}mm",         "Copper wire {t}mm cross-section",       "m"),
        ("Rubber Seal {t}",         "EPDM rubber seal profile {t}",          "m"),
        ("Foam Panel {t}mm",        "Polyurethane insulation {t}mm",         "m2"),
        ("Glass Pane {t}mm",        "Float glass {t}mm tempered",            "m2"),
        ("Hydraulic Hose {t}bar",   "High-pressure hose rated {t}bar",       "m"),
    ]
    product_rows = []
    for i in range(1, N_PRODUCTS + 1):
        tpl = PRODUCT_TEMPLATES[(i - 1) % len(PRODUCT_TEMPLATES)]
        t   = i
        product_rows.append((
            tpl[0].replace("{t}", str(t)),
            tpl[1].replace("{t}", str(t)),
            round(random.uniform(1.0, 999.99), 2),
            tpl[2],
        ))
    n = insert_batched(cur,
        "INSERT INTO products (name, description, unit_price, unit) VALUES %s",
        product_rows)
    print(f"  → {n:,} products inserted")

    cur.execute("SELECT id, unit_price FROM products")
    products = cur.fetchall()   # [(id, unit_price), ...]

    # ── Proposals ────────────────────────────────────────────────────────────
    print(f"Inserting {N_PROPOSALS:,} proposals (this may take a moment)...")
    proposal_rows = []
    for i in range(1, N_PROPOSALS + 1):
        created = rand_date()
        proposal_rows.append((
            f"PROP-{created.year}-{i:06d}",
            random.choice(client_ids),
            random.choice(section_ids),
            random.choice(PROP_STATI),
            random.choice([None, None, "Rush order", "Client revised", "Pending approval", "On hold"]),
            created,
        ))

    n = insert_batched(cur,
        """INSERT INTO proposals
               (reference, client_id, section_id, status, notes, created_at)
           VALUES %s""",
        proposal_rows)
    print(f"  → {n:,} proposals inserted")

    # ── Proposal Items ────────────────────────────────────────────────────────
    print("Inserting proposal items (1–5 per proposal)...")
    cur.execute("SELECT id FROM proposals")
    proposal_ids = [r[0] for r in cur.fetchall()]

    item_rows = []
    for pid in proposal_ids:
        n_items = random.randint(1, 5)
        chosen  = random.sample(products, min(n_items, len(products)))
        for prod_id, unit_price in chosen:
            item_rows.append((
                pid,
                prod_id,
                round(random.uniform(1.0, 100.0), 2),
                unit_price,
                None,
            ))

    n = insert_batched(cur,
        """INSERT INTO proposal_items
               (proposal_id, product_id, quantity, unit_price, notes)
           VALUES %s""",
        item_rows)
    print(f"  → {n:,} proposal items inserted")

    # ── Orders (200 active) ───────────────────────────────────────────────────
    print(f"Inserting {N_ORDERS:,} orders...")
    # Pick N_ORDERS approved proposals to convert into orders
    cur.execute("SELECT id, client_id, section_id FROM proposals WHERE status = 'approved' LIMIT %s", (N_ORDERS,))
    source_proposals = cur.fetchall()

    # If not enough approved proposals exist, fall back to any proposals
    if len(source_proposals) < N_ORDERS:
        cur.execute(
            "SELECT id, client_id, section_id FROM proposals LIMIT %s",
            (N_ORDERS,)
        )
        source_proposals = cur.fetchall()

    order_rows = []
    for i, (prop_id, client_id, section_id) in enumerate(source_proposals[:N_ORDERS], 1):
        created  = rand_date()
        due      = created + timedelta(days=random.randint(14, 120))
        status   = random.choice(["pending", "in_production", "pending", "in_production"])  # bias active
        order_rows.append((
            f"ORD-{created.year}-{i:06d}",
            prop_id,
            client_id,
            section_id,
            status,
            due,
            created,
        ))

    n = insert_batched(cur,
        """INSERT INTO orders
               (reference, proposal_id, client_id, section_id, status, due_date, created_at)
           VALUES %s""",
        order_rows)
    print(f"  → {n:,} orders inserted")

    # ── Order Items ───────────────────────────────────────────────────────────
    print("Inserting order items...")
    cur.execute("SELECT id FROM orders")
    order_ids = [r[0] for r in cur.fetchall()]

    order_item_rows = []
    for oid in order_ids:
        n_items = random.randint(1, 5)
        chosen  = random.sample(products, min(n_items, len(products)))
        for prod_id, unit_price in chosen:
            order_item_rows.append((
                oid,
                prod_id,
                round(random.uniform(1.0, 50.0), 2),
                unit_price,
                None,
            ))

    n = insert_batched(cur,
        """INSERT INTO order_items
               (order_id, product_id, quantity, unit_price, notes)
           VALUES %s""",
        order_item_rows)
    print(f"  → {n:,} order items inserted")

    # ── Audit Log (~150k entries) ─────────────────────────────────────────────
    print("Inserting audit log entries...")
    ACTIONS = ["created", "status_changed", "converted", "updated", "deleted"]
    ENTITIES = ["proposal", "order", "client", "product", "user"]

    audit_rows = []
    for pid in random.sample(proposal_ids, min(50_000, len(proposal_ids))):
        n_events = random.randint(1, 4)
        for _ in range(n_events):
            old_s = random.choice(PROP_STATI)
            new_s = random.choice(PROP_STATI)
            audit_rows.append((
                random.choice(user_ids),
                "proposal",
                pid,
                random.choice(ACTIONS),
                f'{{"status": "{old_s}"}}',
                f'{{"status": "{new_s}"}}',
            ))

    for oid in order_ids:
        old_s = random.choice(ORD_STATI)
        new_s = random.choice(ORD_STATI)
        audit_rows.append((
            random.choice(user_ids),
            "order",
            oid,
            "status_changed",
            f'{{"status": "{old_s}"}}',
            f'{{"status": "{new_s}"}}',
        ))

    random.shuffle(audit_rows)
    n = insert_batched(cur,
        """INSERT INTO audit_log
               (user_id, entity_type, entity_id, action, old_value, new_value)
           VALUES %s""",
        audit_rows)
    print(f"  → {n:,} audit log entries inserted")

    # ── Commit ────────────────────────────────────────────────────────────────
    conn.commit()
    cur.close()
    conn.close()

    print("\n✓ Done! Database stress-test data loaded successfully.")

if __name__ == "__main__":
    main()
