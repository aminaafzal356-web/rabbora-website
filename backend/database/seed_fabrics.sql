-- =====================================================================
-- Rabbora Living — fabric catalogue seed          database/seed_fabrics.sql
-- ---------------------------------------------------------------------
-- Fills the "fabrics" table (created by ecommerce_core.sql) with the 95
-- fabrics the website already offers. Nothing is invented: every slug,
-- name, collection and image path is copied from the frontend fabric
-- list, which is identical in all 11 page files:
--   ottoman-beds.js, solid-base-ottomans.js, storage-drawers.js,
--   tv-beds.js, kids-beds.js, high-headboard-beds.js, bed-frames.js,
--   best-sellers.js, rapid-delivery-beds.js, sofas.js, blanket-boxes.js
--   (the same 95 names are also on fabric-samples.html).
-- 10 collections: Plush 21, Coniston 6, Naples 13, Crushed Velvet 14,
-- Chenille 11, Linoso 8, Boucle 4, Naples Alternative 6,
-- Additional Colours 9, Marble 3.
--
-- Not a fabric, so not included: the page choice
-- "Same as main display picture".
--
-- Safety:
--   * Only INSERTs into "fabrics". No product, price, variant, image,
--     user or cart row is touched. Nothing is deleted or updated.
--   * Safe to run more than once: a fabric whose slug OR name is already
--     in the table is skipped (ON CONFLICT (slug) DO NOTHING + name check),
--     so no duplicates and no overwriting of anything already there.
--   * One transaction; the check at the end stops and rolls back if the
--     95 fabrics are not all present afterwards.
--   * No fabric price: the website charges nothing extra for a fabric.
--     Which products offer which fabric (product_fabrics) is NOT filled
--     here — every page offers the full list, so it can be linked later.
--
-- Run AFTER ecommerce_core.sql, in pgAdmin (rabbora database, Query Tool).
-- =====================================================================

BEGIN;

CREATE TEMP TABLE seed_fabric_rows (
    slug        VARCHAR(100) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    collection  VARCHAR(100) NOT NULL,
    image_url   TEXT NOT NULL,
    sort_order  INTEGER NOT NULL
) ON COMMIT DROP;

INSERT INTO seed_fabric_rows (slug, name, collection, image_url, sort_order) VALUES
    -- Plush
    ('plush-grey', 'Plush Grey', 'Plush', 'fabric/plush-grey.jfif', 1),
    ('plush-silver', 'Plush Silver', 'Plush', 'fabric/plush-silver.jfif', 2),
    ('plush-steel', 'Plush Steel', 'Plush', 'fabric/plush-steel.jfif', 3),
    ('plush-cream', 'Plush Cream', 'Plush', 'fabric/plush-cream.jfif', 4),
    ('plush-beige', 'Plush Beige', 'Plush', 'fabric/plush-beige.jfif', 5),
    ('plush-black', 'Plush Black', 'Plush', 'fabric/plush-black.jfif', 6),
    ('plush-pink', 'Plush Pink', 'Plush', 'fabric/plush-pink.jfif', 7),
    ('plush-mustard', 'Plush Mustard', 'Plush', 'fabric/plush-mustard.jfif', 8),
    ('plush-green', 'Plush Green', 'Plush', 'fabric/plush-green.jfif', 9),
    ('plush-turquoise', 'Plush Turquoise', 'Plush', 'fabric/plush-turquoise.jfif', 10),
    ('plush-royal-blue', 'Plush Royal Blue', 'Plush', 'fabric/plush-royal-blue.jfif', 11),
    ('plush-white', 'Plush White', 'Plush', 'fabric/plush-white.jfif', 12),
    ('plush-baby-pink', 'Plush Baby Pink', 'Plush', 'fabric/plush-baby-pink.jfif', 13),
    ('plush-ice-silver', 'Plush Ice Silver', 'Plush', 'fabric/plush-ice-sliver.jfif', 14),
    ('plush-pebble', 'Plush Pebble', 'Plush', 'fabric/plush-pebble.jfif', 15),
    ('plush-mocca', 'Plush Mocca', 'Plush', 'fabric/plush-mocca.jfif', 16),
    ('plush-emerald-green', 'Plush Emerald Green', 'Plush', 'fabric/plush-emerald-green.jfif', 17),
    ('plush-duck-egg', 'Plush Duck Egg', 'Plush', 'fabric/plush-duck-egg.jfif', 18),
    ('plush-camel', 'Plush Camel', 'Plush', 'fabric/plush-camel.jfif', 19),
    ('plush-teal', 'Plush Teal', 'Plush', 'fabric/plush-teal.jfif', 20),
    ('plush-plum', 'Plush Plum', 'Plush', 'fabric/plush-plum.jfif', 21),
    -- Coniston
    ('coniston-charcoal', 'Coniston Charcoal', 'Coniston', 'fabric/coniston-charcoal.jfif', 22),
    ('coniston-almond', 'Coniston Almond', 'Coniston', 'fabric/coniston-almond.jfif', 23),
    ('coniston-armour', 'Coniston Armour', 'Coniston', 'fabric/coniston-armour.jfif', 24),
    ('coniston-emerald', 'Coniston Emerald', 'Coniston', 'fabric/coniston-emerald.jfif', 25),
    ('coniston-pink', 'Coniston Pink', 'Coniston', 'fabric/coniston-pink.jfif', 26),
    ('coniston-blue', 'Coniston Blue', 'Coniston', 'fabric/coniston-blue.jfif', 27),
    -- Naples
    ('naples-silver', 'Naples Silver', 'Naples', 'fabric/naples-silver.jfif', 28),
    ('naples-steel', 'Naples Steel', 'Naples', 'fabric/naples-steel.jfif', 29),
    ('naples-black', 'Naples Black', 'Naples', 'fabric/naples-black.jfif', 30),
    ('naples-ivory', 'Naples Ivory', 'Naples', 'fabric/naples-ivory.jfif', 31),
    ('naples-pearl-blue', 'Naples Pearl Blue', 'Naples', 'fabric/naples-pearl-blue.jfif', 32),
    ('naples-cream', 'Naples Cream', 'Naples', 'fabric/naples-cream.jfif', 33),
    ('naples-sand', 'Naples Sand', 'Naples', 'fabric/naples-sand.jfif', 34),
    ('naples-mink', 'Naples Mink', 'Naples', 'fabric/naples-mink.jfif', 35),
    ('naples-seal-grey', 'Naples Seal Grey', 'Naples', 'fabric/naples-seal-grey.jfif', 36),
    ('naples-slate-grey', 'Naples Slate Grey', 'Naples', 'fabric/naples-slate-grey.jfif', 37),
    ('naples-charcoal', 'Naples Charcoal', 'Naples', 'fabric/naples-charcoal.jfif', 38),
    ('naples-blue', 'Naples Blue', 'Naples', 'fabric/naples-blue.jfif', 39),
    ('naples-plum', 'Naples Plum', 'Naples', 'fabric/naples-plum.jfif', 40),
    -- Crushed Velvet
    ('crushed-velvet-silver', 'Crushed Velvet Silver', 'Crushed Velvet', 'fabric/crushed-velvet-silver.jfif', 41),
    ('crushed-velvet-black', 'Crushed Velvet Black', 'Crushed Velvet', 'fabric/crushed-velvet-black.jfif', 42),
    ('crushed-velvet-cream', 'Crushed Velvet Cream', 'Crushed Velvet', 'fabric/crushed-velvet-cream.jfif', 43),
    ('crushed-velvet-mink', 'Crushed Velvet Mink', 'Crushed Velvet', 'fabric/crushed-velvet-mink.jfif', 44),
    ('crushed-velvet-white', 'Crushed Velvet White', 'Crushed Velvet', 'fabric/crushed-white.jfif', 45),
    ('crushed-velvet-grey', 'Crushed Velvet Grey', 'Crushed Velvet', 'fabric/crushed-grey.jfif', 46),
    ('crushed-velvet-camel', 'Crushed Velvet Camel', 'Crushed Velvet', 'fabric/crushed-camel.jfif', 47),
    ('crushed-velvet-gold', 'Crushed Velvet Gold', 'Crushed Velvet', 'fabric/crushed-gold.jfif', 48),
    ('crushed-velvet-teal', 'Crushed Velvet Teal', 'Crushed Velvet', 'fabric/crushed-teal.jfif', 49),
    ('crushed-velvet-denim', 'Crushed Velvet Denim', 'Crushed Velvet', 'fabric/crushed-denim.jfif', 50),
    ('crushed-velvet-hot-pink', 'Crushed Velvet Hot Pink', 'Crushed Velvet', 'fabric/crushed-hot-pink.jfif', 51),
    ('crushed-velvet-purple', 'Crushed Velvet Purple', 'Crushed Velvet', 'fabric/crushed-purple.jfif', 52),
    ('crushed-velvet-plum', 'Crushed Velvet Plum', 'Crushed Velvet', 'fabric/crushed-plum.jfif', 53),
    ('crushed-velvet-baby-pink', 'Crushed Velvet Baby Pink', 'Crushed Velvet', 'fabric/crushed-baby-pink.jfif', 54),
    -- Chenille
    ('chenille-cream', 'Chenille Cream', 'Chenille', 'fabric/chenille-cream.jfif', 55),
    ('chenille-mink', 'Chenille Mink', 'Chenille', 'fabric/chenille-mink.jfif', 56),
    ('chenille-chocolate', 'Chenille Chocolate', 'Chenille', 'fabric/chenille-chocolate.jfif', 57),
    ('chenille-steel', 'Chenille Steel', 'Chenille', 'fabric/chenille-steel.jfif', 58),
    ('chenille-charcoal', 'Chenille Charcoal', 'Chenille', 'fabric/chenille-charcoal.jfif', 59),
    ('chenille-duck-egg', 'Chenille Duck Egg', 'Chenille', 'fabric/chenille-duck-egg.jfif', 60),
    ('chenille-teal', 'Chenille Teal', 'Chenille', 'fabric/chenille-teal.jfif', 61),
    ('chenille-purple', 'Chenille Purple', 'Chenille', 'fabric/chenille-purple.jfif', 62),
    ('chenille-plum', 'Chenille Plum', 'Chenille', 'fabric/chenille-plum.jfif', 63),
    ('chenille-red', 'Chenille Red', 'Chenille', 'fabric/chenille-red.jfif', 64),
    ('chenille-black', 'Chenille Black', 'Chenille', 'fabric/chenille-black.jfif', 65),
    -- Linoso
    ('linoso-sand', 'Linoso Sand', 'Linoso', 'fabric/linoso-sand.jfif', 66),
    ('linoso-silver', 'Linoso Silver', 'Linoso', 'fabric/linoso-silver.jfif', 67),
    ('linoso-slate-grey', 'Linoso Slate Grey', 'Linoso', 'fabric/linoso-slate-grey.jfif', 68),
    ('linoso-charcoal', 'Linoso Charcoal', 'Linoso', 'fabric/linoso-charcoal.jfif', 69),
    ('linoso-truffle', 'Linoso Truffle', 'Linoso', 'fabric/linoso-truffle.jfif', 70),
    ('linoso-black', 'Linoso Black', 'Linoso', 'fabric/linoso-black.jfif', 71),
    ('linoso-midnight-blue', 'Linoso Midnight Blue', 'Linoso', 'fabric/linoso-midnight-blue.jfif', 72),
    ('linoso-plum', 'Linoso Plum', 'Linoso', 'fabric/linoso-plum.jfif', 73),
    -- Boucle
    ('boucle-granite', 'Boucle Granite', 'Boucle', 'fabric/boucle-granite.jfif', 74),
    ('boucle-dove', 'Boucle Dove', 'Boucle', 'fabric/boucle-dove.jfif', 75),
    ('boucle-ivory', 'Boucle Ivory', 'Boucle', 'fabric/boucle-ivory.jfif', 76),
    ('boucle-truffle', 'Boucle Truffle', 'Boucle', 'fabric/boucle-truffle.jfif', 77),
    -- Naples Alternative
    ('grey-naples', 'Grey Naples', 'Naples Alternative', 'fabric/plush-grey.jfif', 78),
    ('sand-naples', 'Sand Naples', 'Naples Alternative', 'fabric/naples-sand.jfif', 79),
    ('silver-naples', 'Silver Naples', 'Naples Alternative', 'fabric/Naples-Silver.jfif', 80),
    ('black-naples', 'Black Naples', 'Naples Alternative', 'fabric/Naples-Black.jfif', 81),
    ('brown-naples', 'Brown Naples', 'Naples Alternative', 'fabric/naple-brown.jfif', 82),
    ('cream-naples', 'Cream Naples', 'Naples Alternative', 'fabric/naples-cream.jfif', 83),
    -- Additional Colours
    ('dove', 'Dove', 'Additional Colours', 'fabric/dove.jfif', 84),
    ('ivory', 'Ivory', 'Additional Colours', 'fabric/ivory.jfif', 85),
    ('latte', 'Latte', 'Additional Colours', 'fabric/latte.jfif', 86),
    ('mink', 'Mink', 'Additional Colours', 'fabric/mink.jfif', 87),
    ('truffle', 'Truffle', 'Additional Colours', 'fabric/truffle.jfif', 88),
    ('saffron', 'Saffron', 'Additional Colours', 'fabric/saffron.jfif', 89),
    ('powder', 'Powder', 'Additional Colours', 'fabric/powder.jfif', 90),
    ('sky', 'Sky', 'Additional Colours', 'fabric/sky.jfif', 91),
    ('marine', 'Marine', 'Additional Colours', 'fabric/marrine.jfif', 92),
    -- Marble
    ('marble-oatmeal', 'Marble Oatmeal', 'Marble', 'fabric/marble-oatmeal.jfif', 93),
    ('marble-platinum', 'Marble Platinum', 'Marble', 'fabric/marble-platinum.jfif', 94),
    ('marble-silver', 'Marble Silver', 'Marble', 'fabric/marble-silver.jfif', 95);

INSERT INTO fabrics (slug, name, collection, image_url, sort_order, is_active)
SELECT s.slug, s.name, s.collection, s.image_url, s.sort_order, TRUE
  FROM seed_fabric_rows s
 WHERE NOT EXISTS (SELECT 1 FROM fabrics f WHERE lower(f.name) = lower(s.name))
 ORDER BY s.sort_order
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    missing INTEGER;
BEGIN
    SELECT count(*) INTO missing
      FROM seed_fabric_rows s
     WHERE NOT EXISTS (SELECT 1 FROM fabrics f WHERE f.slug = s.slug OR lower(f.name) = lower(s.name));
    IF missing > 0 THEN
        RAISE EXCEPTION 'Stopped, nothing saved: % fabrics are missing after the seed', missing;
    END IF;
END $$;

COMMIT;

-- Check (read-only): expected 95 rows in 10 collections.
-- SELECT collection, count(*) FROM fabrics GROUP BY collection ORDER BY min(sort_order);