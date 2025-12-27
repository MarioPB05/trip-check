CREATE TABLE IF NOT EXISTS trip (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  status INTEGER NOT NULL,
  travelers INTEGER NOT NULL,
  trip_start_date TEXT NOT NULL,
  trip_end_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS location (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  trip_id INTEGER NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  emoji TEXT,
  name TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS template (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS template_item (
 template_id INTEGER NOT NULL,
 item_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY (template_id, item_id),
  FOREIGN KEY (template_id) REFERENCES template(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE IF NOT EXISTS template_location (
 template_id INTEGER NOT NULL,
 location_id INTEGER NOT NULL,
 PRIMARY KEY (template_id, location_id),
  FOREIGN KEY (template_id) REFERENCES template(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE IF NOT EXISTS location_item (
 start_location_id INTEGER NOT NULL,
 end_location_id INTEGER NOT NULL,
 item_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL DEFAULT 0,
 added INTEGER NOT NULL DEFAULT 0,
 lost INTEGER NOT NULL DEFAULT 0,
 uses INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY (start_location_id, end_location_id, item_id),
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  FOREIGN KEY (start_location_id) REFERENCES location(id),
  FOREIGN KEY (end_location_id) REFERENCES location(id),
  FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE IF NOT EXISTS item_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id INTEGER NOT NULL,
  location_item_id INTEGER NOT NULL,
  status INTEGER NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE,
  FOREIGN KEY (location_item_id) REFERENCES location_item(id)
);

CREATE INDEX IF NOT EXISTS idx_location_trip ON location(trip_id);
CREATE INDEX IF NOT EXISTS idx_template_item_item ON template_item(item_id);
CREATE INDEX IF NOT EXISTS idx_location_item_item ON location_item(item_id);

