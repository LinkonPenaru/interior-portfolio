-- ============================================================================
-- SUPABASE SEED DATA: 3 VERIFIED PDF ARCHITECTURAL PROJECTS
-- ============================================================================
-- Inserts the 3 verified interior architecture projects from:
-- 1. Id  kitchen.pdf
-- 2. Id  Master bedroom.pdf
-- 3. Id (kids bedroom).pdf
-- ============================================================================

INSERT INTO public.projects (
    slug,
    title,
    subtitle,
    short_description,
    description,
    category,
    cover_image,
    gallery_images,
    published,
    featured,
    sort_order,
    source_pdf,
    institution,
    academic_class,
    sheet_scale,
    completion_date,
    concept_philosophy,
    color_palette,
    materials,
    appliances,
    key_highlights,
    pending_designer_notes
)
VALUES
-- PROJECT 1: MODERN CONTEMPORARY KITCHEN
(
    'modern-contemporary-kitchen',
    'Modern Contemporary Kitchen',
    'Luxury Spatial Architecture & Joinery Drafting',
    'A contemporary culinary space balancing olive green matte cabinetry, warm copper fixtures, and dark green veined marble worktops.',
    'Designed as an investigation into contemporary culinary living, this project balances refined architectural geometry, clean sightlines, and generous material warmth. Custom joinery details—including overhead cabinets, toe kicks, water drip profiles, and a high-efficiency magic corner unit—are drafted with millimeter precision alongside a complete appliance specification schedule.',
    'kitchen',
    '/projects/kitchen/kitchen-perspective-views.webp',
    '[
      {
        "id": "kit-07",
        "url": "/projects/kitchen/kitchen-perspective-views.webp",
        "title": "Interior Perspective Views (1 View & 2 View)",
        "sheetType": "render",
        "caption": "Central one-point perspective and two-point axonometric view illustrating olive cabinetry, marble backsplash, stove, and Roman window blind.",
        "sourcePage": 7
      },
      {
        "id": "kit-02",
        "url": "/projects/kitchen/kitchen-concept-style-sheet.webp",
        "title": "Modern Contemporary Style Sheet",
        "sheetType": "material-board",
        "caption": "Conceptual palette displaying olive green matte cabinetry swatches, copper hardware samples, and white/dark green marble platforms.",
        "sourcePage": 2
      },
      {
        "id": "kit-06",
        "url": "/projects/kitchen/kitchen-layout-floor-plan.webp",
        "title": "Rendered Kitchen Layout Floor Plan",
        "sheetType": "plan",
        "caption": "Detailed 1:10 scale plan denoting counter top (600x700mm), overhead units (300x600mm), fridge (800x700x1850mm), and work-triangle zoning.",
        "sourcePage": 6
      },
      {
        "id": "kit-03",
        "url": "/projects/kitchen/kitchen-technical-joinery-details.webp",
        "title": "Technical Kitchen Joinery Details",
        "sheetType": "detail",
        "caption": "Joinery cross-sections at 1:2 and 1:10 scale: overhead cabinet strip light rebate, toe kick, marble water drip, and magic corner.",
        "sourcePage": 3
      },
      {
        "id": "kit-04",
        "url": "/projects/kitchen/kitchen-appliance-specification-schedule.webp",
        "title": "Marketing Appliances Specification Schedule",
        "sheetType": "schedule",
        "caption": "Detailed technical appliance schedule specifying Samsung, KitchenAid, iBell, and Farberware models, sizes, wattage, and prices.",
        "sourcePage": 4
      },
      {
        "id": "kit-08",
        "url": "/projects/kitchen/kitchen-elevation-section-aa.webp",
        "title": "Section ''A-A'' Elevation",
        "sheetType": "elevation",
        "caption": "Elevation drawing showing false ceiling line, spice storage cabinets, chimney, electrical induction stove, and under-counter oven.",
        "sourcePage": 8
      },
      {
        "id": "kit-09",
        "url": "/projects/kitchen/kitchen-elevation-section-bb.webp",
        "title": "Section ''B-B'' Elevation",
        "sheetType": "elevation",
        "caption": "Elevation section showing tall refrigerator niche, wooden spice rack shelving, and olive cabinetry elevation.",
        "sourcePage": 9
      },
      {
        "id": "kit-10",
        "url": "/projects/kitchen/kitchen-elevation-sections-cc-dd.webp",
        "title": "Section ''C-C'' & Section ''D-D'' Elevations",
        "sheetType": "elevation",
        "caption": "Dual cross-sections highlighting window sill junction, roman blinds, undermount sink, and base drawer modules.",
        "sourcePage": 10
      },
      {
        "id": "kit-05",
        "url": "/projects/kitchen/kitchen-preliminary-layout-plan.webp",
        "title": "Preliminary Floor Layout & Tile Grid",
        "sheetType": "plan",
        "caption": "Drafting grid showing starting tile alignment, door swing clearance, and sectional cutting planes.",
        "sourcePage": 5
      },
      {
        "id": "kit-01",
        "url": "/projects/kitchen/kitchen-cover-sheet.webp",
        "title": "Academic Portfolio Cover Sheet",
        "sheetType": "schedule",
        "caption": "Original hand-lettered portfolio cover sheet verifying Urvi G Eragola, FYBVOC Roll No: 14.",
        "sourcePage": 1
      }
    ]'::jsonb,
    true,
    true,
    1,
    'Id  kitchen.pdf',
    'Rachana Sansad''s Academy of Architecture, B. Voc. (Interior Design), Mumbai',
    'FYBVOC (Roll No: 14)',
    '1:10 (Layout Plan) / 1:2 & 1:10 (Joinery Details)',
    'Academic Year 2025 – 2026',
    'Contemporary kitchen design focusing on current living trends, clean continuous lines, and open spatial interaction. Natural luxurious stone finishes complement metallic warm copper and soft matte foliage tones.',
    '[
      {"name": "Olive Green Matte", "colorCode": "#4A5841", "description": "Under-counter and overhead cabinetry finish"},
      {"name": "Warm Copper", "colorCode": "#C16B45", "description": "Handles, sink basin, and swan-neck mixer tap"},
      {"name": "White & Dark Green Veined Marble", "colorCode": "#2E4839", "description": "Continuous countertop platform and full-height backsplash"},
      {"name": "Charcoal Black", "colorCode": "#242424", "description": "Built-in induction cooktop, refrigerator, and chimney"}
    ]'::jsonb,
    '[
      {"name": "Olive Green Matte Cabinetry", "category": "cabinetry", "specifications": "Custom modular units with hidden groove and copper hardware"},
      {"name": "White & Dark Green Veined Marble Countertop", "category": "surface", "specifications": "20mm natural marble slab with water-drip detail and 10mm screed"},
      {"name": "Copper Undermount Sink & Swan Tap", "brand": "Copperline Studio", "category": "sanitaryware", "specifications": "Deep rectangular copper basin with matching tap"},
      {"name": "Under-Cabinet Strip Lighting", "category": "lighting", "specifications": "Warm white linear LED strip recessed into overhead cabinet rebate"}
    ]'::jsonb,
    '[
      {"item": "Cookware Stockpot Set", "brand": "Farberware", "model": "7823988018", "dimensions": "1.5qt, 3.5qt, 1.6qt", "price": "₹3,000"},
      {"item": "Air Fryer", "brand": "Cosori", "model": "CP158-AF", "dimensions": "12.6\" x 11.8\" x 11.8\" (5.8qt, 1700W)", "price": "₹9,990"},
      {"item": "2-Slice Smart Toaster", "brand": "Y550A", "model": "B0CMH9RWZW", "dimensions": "26.4 x 15.9 x 17.8 cm (825W)", "price": "₹21,776"},
      {"item": "Stainless Steel Electric Kettle", "brand": "Kazenzo", "model": "KZN Kittle 75", "dimensions": "20 cm height", "price": "₹1,119"},
      {"item": "Family Hub Smart Refrigerator", "brand": "Samsung", "model": "RF71DB9950QD", "dimensions": "35.7\" x 35.88\" x 71.8\"", "price": "₹3,50,000"},
      {"item": "Stand Bowl-Mixer", "brand": "KitchenAid", "model": "TY-589", "dimensions": "16.5\" x 11.31\" x 14.63\" (500W)", "price": "₹75,000"},
      {"item": "12-Function Power Blender", "brand": "Hamilton Beach", "model": "58148A", "dimensions": "8.66\" x 6.5\" x 14.69\" (700W)", "price": "₹4,700"},
      {"item": "Induction Cooktop", "brand": "iBell", "model": "Eminence 03EZ", "dimensions": "74 x 43 x 8.7 cm (5600W)", "price": "₹54,999"},
      {"item": "Convection Microwave Oven", "brand": "Samsung", "model": "MS23T5012UK/TL", "dimensions": "51.7 x 31.0 x 47.5 cm (28L)", "price": "₹19,000"},
      {"item": "Non-Stick Frying Pan Set", "brand": "BergHOFF", "model": "B07F69GNQ4", "dimensions": "20cm + 24cm + 28cm", "price": "₹6,299"}
    ]'::jsonb,
    '[
      "Comprehensive appliance schedule totaling ₹5,45,883 MRP",
      "Millimeter-level architectural joinery sections at 1:2 and 1:10 scale",
      "Dual perspective drawings (1-point central perspective and 2-point axonometric)",
      "Four architectural elevation cross-sections (A-A, B-B, C-C, D-D)"
    ]'::jsonb,
    '[
      "Specific physical project site address (awaiting designer confirmation)",
      "High-resolution photographed installation pictures if executed on site"
    ]'::jsonb
),

-- PROJECT 2: THEMATIC MASTER BEDROOM SUITE
(
    'thematic-master-bedroom-suite',
    'Thematic Master Bedroom Suite',
    'Dramatic Spatial Narrative & 2BHK Master Layout',
    'A bold, theatrical master suite featuring fluted crimson accent paneling, Nero Marquina black marble bath, and custom dressing room.',
    'Developed through a conceptual client character study (Yumeko Jabami, Kakegurui), this master bedroom suite explores theatrical drama, high-contrast materiality, and tailored psychological zoning. The space integrates a master sleeping quarter with dramatic crimson paneling, a walk-in wardrobe with luxury handbag display vitrines, and an ensuite bath encased in Nero Marquina black marble and ruby accents.',
    'bedroom',
    '/projects/master-bedroom/master-bedroom-presentation-floor-plan.webp',
    '[
      {
        "id": "mb-07",
        "url": "/projects/master-bedroom/master-bedroom-presentation-floor-plan.webp",
        "title": "Master Bedroom Presentation Plan (1:15)",
        "sheetType": "plan",
        "caption": "Full-color rendered plan showing king bed suite, strategy table lounge, walk-in dressing wardrobe, and ensuite bath with ruby tub.",
        "sourcePage": 7
      },
      {
        "id": "mb-03",
        "url": "/projects/master-bedroom/residence-2bhk-master-layout-plan.webp",
        "title": "Overall 2BHK Residence Master Plan (1:25)",
        "sheetType": "plan",
        "caption": "Master architectural layout connecting the Master Suite, Central Living & Dining Room, Kitchen, and Kids Bedroom.",
        "sourcePage": 3
      },
      {
        "id": "mb-08",
        "url": "/projects/master-bedroom/master-bedroom-elevation-sections-cc-dd.webp",
        "title": "Sections ''C-C'' & ''D-D'' Elevations",
        "sheetType": "elevation",
        "caption": "Elevations detailing the fluted crimson headboard wall with playing card art, arched dressing entry, and glass bathroom divider.",
        "sourcePage": 8
      },
      {
        "id": "mb-09",
        "url": "/projects/master-bedroom/master-bedroom-elevation-sections-aa-bb.webp",
        "title": "Sections ''A-A'' & ''B-B'' Elevations",
        "sheetType": "elevation",
        "caption": "Section A-A shows floor-to-ceiling windows with drapes; Section B-B shows custom illuminated handbag wardrobe and Hollywood vanity mirror.",
        "sourcePage": 9
      },
      {
        "id": "mb-10",
        "url": "/projects/master-bedroom/master-bedroom-ensuite-bath-elevations.webp",
        "title": "Sections ''E-E'' & ''F-F'' Ensuite Bathroom",
        "sheetType": "elevation",
        "caption": "Ensuite elevations highlighting cherry blossom wall covering, ruby red soaking tub, wall-mounted mirror, and Nero Marquina shower stall.",
        "sourcePage": 10
      },
      {
        "id": "mb-04",
        "url": "/projects/master-bedroom/master-bedroom-electrical-looping-schedule.webp",
        "title": "Electrical Looping & Switchboard Schedule",
        "sheetType": "schedule",
        "caption": "Technical drafting sheet documenting SB1, SB2, SB3 switchboards, AC connections, geyser points, and light loop circuits.",
        "sourcePage": 4
      },
      {
        "id": "mb-05",
        "url": "/projects/master-bedroom/master-bedroom-reflected-ceiling-plan.webp",
        "title": "Reflected Ceiling Plan (1:15)",
        "sheetType": "detail",
        "caption": "Ceiling plan with +2850 level indicators, dropped gypsum coves, fan positioning, and downlight grids across all zones.",
        "sourcePage": 5
      },
      {
        "id": "mb-06",
        "url": "/projects/master-bedroom/master-bedroom-flooring-material-plan.webp",
        "title": "Flooring Material Layout & Schedule",
        "sheetType": "material-board",
        "caption": "Flooring specification detailing IndiaMART brown wood planks (1200x190mm) and Etsy Nero Marquina tiles (600x600mm) with cost estimates.",
        "sourcePage": 6
      },
      {
        "id": "mb-01",
        "url": "/projects/master-bedroom/master-bedroom-client-profile-mood-board.webp",
        "title": "Client Profile & Concept Mood Board",
        "sheetType": "material-board",
        "caption": "Thematic character study (Yumeko Jabami) exploring psychological tension, luxury gaming, and high-contrast dramatic ambience.",
        "sourcePage": 1
      },
      {
        "id": "mb-02",
        "url": "/projects/master-bedroom/master-bedroom-title-sheet.webp",
        "title": "Project Title Cover Sheet",
        "sheetType": "schedule",
        "caption": "Original academic sheet lettered by Urvi G Eragola, FYBVOC Roll No: 14.",
        "sourcePage": 2
      }
    ]'::jsonb,
    true,
    true,
    2,
    'Id  Master bedroom.pdf',
    'Rachana Sansad''s Academy of Architecture, B. Voc. (Interior Design), Mumbai',
    'FYBVOC (Roll No: 14)',
    '1:15 (Master Bedroom Suite) / 1:25 (Overall 2BHK Residence Plan)',
    'Academic Year 2026',
    'Luxurious, dramatic, and slightly dark interior aesthetic designed around tactical elegance and theatrical atmosphere. Warm natural timber balances intense crimson wall finishes and polished deep stone.',
    '[
      {"name": "Crimson Red", "colorCode": "#8E1E28", "description": "Fluted bed backdrop, ruby soaking tub, and upholstery accents"},
      {"name": "Nero Marquina Black", "colorCode": "#1A1A1C", "description": "Black veined marble tile in ensuite shower and floor"},
      {"name": "Deep Walnut Timber", "colorCode": "#5C3E26", "description": "Natural plank flooring and millwork framing"},
      {"name": "Architectural Charcoal & White", "colorCode": "#383431", "description": "Wardrobe cabinetry, ceiling drops, and sheer drapery"}
    ]'::jsonb,
    '[
      {"name": "Natural Brown Wood Flooring", "brand": "IndiaMART", "category": "flooring", "specifications": "1200 x 190 mm planks, 20mm thickness", "price": "₹550 / sq.ft"},
      {"name": "Nero Marquina Marble Tile", "brand": "Etsy", "category": "flooring", "specifications": "600 x 600 mm black marble with white veining", "price": "₹177 / piece"},
      {"name": "Crimson Fluted Wall Cladding", "category": "surface", "specifications": "Vertical fluted acoustic paneling in semi-gloss crimson"},
      {"name": "Hollywood Dressing Mirror", "category": "lighting", "specifications": "Vanity mirror framed with integrated spherical bulbs"}
    ]'::jsonb,
    '[
      {"item": "King Size Bed Frame", "brand": "Custom Carpentry", "dimensions": "2000 x 1800 x 600 mm"},
      {"item": "Upholstered Footstool", "brand": "Custom Carpentry", "dimensions": "1500 x 450 x 500 mm"},
      {"item": "Bedside Nightstands (2)", "brand": "Custom Carpentry", "dimensions": "450 x 450 x 450 mm"},
      {"item": "Master Suite Area Rug", "brand": "Textile Custom", "dimensions": "2500 x 2000 x 5 mm"},
      {"item": "Full Height Wardrobe Unit", "brand": "Custom Millwork", "dimensions": "600 x 2400 mm height"},
      {"item": "Freestanding Soaking Bathtub", "brand": "Luxury Sanitaryware", "dimensions": "1500 x 800 x 600 mm (Ruby Red)"}
    ]'::jsonb,
    '[
      "Comprehensive 2BHK residence master plan establishing spatial relationships",
      "Technical electrical looping diagram with 3 dedicated switchboards (SB1, SB2, SB3)",
      "Reflected false ceiling plan with +2850mm levels and cove lighting",
      "Bespoke walk-in wardrobe with lit accessories display shelves and Hollywood mirror"
    ]'::jsonb,
    '[
      "Preferred residential client description if replacing character study",
      "Final fixture brand confirmation for master bathtub and vanity tapware"
    ]'::jsonb
),

-- PROJECT 3: A SKY BEDROOM (KIDS ROOM)
(
    'a-sky-bedroom-kids-room',
    'A Sky Bedroom',
    'Playful Celestial & Cloud Children''s Interior',
    'A stimulating children''s space featuring cloud-shaped joinery, rainbow arch bookshelf, fiber-optic star ceiling, and geometric tiled bath.',
    'Conceived as an imaginative sanctuary for play, study, and restful retreat, ''A Sky Bedroom'' captures the freedom of the celestial sky. Cloud silhouettes shape the headboard and study desk, while a colorful rainbow arch sweeps upward into a cantilevered bookshelf. The room is completed by a fiber-optic starry night sky ceiling and an en-suite bathroom with geometric blue and white motif tiles.',
    'kids',
    '/projects/kids-bedroom/kids-bedroom-perspective-rainbow-elevation.webp',
    '[
      {
        "id": "kb-03",
        "url": "/projects/kids-bedroom/kids-bedroom-perspective-rainbow-elevation.webp",
        "title": "Perspective View & Elevation ''AA'' - ''BB''",
        "sheetType": "render",
        "caption": "Hand-drawn 3D perspective showcasing the rainbow arch wall ascending to the bookshelf, cloud study table, and bed.",
        "sourcePage": 3
      },
      {
        "id": "kb-01",
        "url": "/projects/kids-bedroom/kids-bedroom-concept-mood-board.webp",
        "title": "A Sky Bedroom Concept & Mood Board",
        "sheetType": "material-board",
        "caption": "Design philosophy, celestial color swatches (sky blue, navy, rainbow), cloud lamps, and animal decor notes.",
        "sourcePage": 1
      },
      {
        "id": "kb-02",
        "url": "/projects/kids-bedroom/kids-bedroom-layout-floor-plan.webp",
        "title": "Kids Bedroom Layout Floor Plan (1:10)",
        "sheetType": "plan",
        "caption": "Dimensioned furniture plan with bed (1800x900), cloud study table, bookshelf, and two-tone wardrobe.",
        "sourcePage": 2
      },
      {
        "id": "kb-04",
        "url": "/projects/kids-bedroom/kids-bedroom-elevation-wardrobe-view.webp",
        "title": "Elevation & Wardrobe Perspective View",
        "sheetType": "elevation",
        "caption": "Perspective elevation showing vertical sky blue wall paneling and two-tone arched wardrobe with round black handle.",
        "sourcePage": 4
      },
      {
        "id": "kb-05",
        "url": "/projects/kids-bedroom/kids-bedroom-ensuite-bathroom-details.webp",
        "title": "Kids Bathroom Plan, Elevation & 3D View (1:15)",
        "sheetType": "detail",
        "caption": "En-suite bath with Amtico quarter-circle pattern tiles, Jaquar shower stall, Kohler sanitary fixtures, and backlit mirror.",
        "sourcePage": 5
      },
      {
        "id": "kb-06",
        "url": "/projects/kids-bedroom/kids-bedroom-starry-ceiling-plan.webp",
        "title": "Starry Sky False Ceiling Plan",
        "sheetType": "plan",
        "caption": "Reflected ceiling technical layout indicating perimeter spotlights and central fiber-optic starry night sky matrix.",
        "sourcePage": 6
      },
      {
        "id": "kb-07",
        "url": "/projects/kids-bedroom/kids-bedroom-bathroom-tiling-layout.webp",
        "title": "Bathroom Tiling Grid & Plumbing Schedule",
        "sheetType": "schedule",
        "caption": "Detailed tile cutting grid, plumbing fixture elevations, and Kohler/Jaquar pricing breakdown.",
        "sourcePage": 7
      }
    ]'::jsonb,
    true,
    true,
    3,
    'Id (kids bedroom).pdf',
    'Rachana Sansad''s Academy of Architecture, B. Voc. (Interior Design), Mumbai',
    'FYBVOC (Roll No: 14)',
    '1:10 (Kids Room Plan) / 1:15 (Bathroom Plan & Elevations) / 1:20 (Elevations)',
    'Academic Year 2025',
    'A celestial and cloud-filled environment evoking the feeling of being outdoors under the open sky. Sky blues, soft cloud greys, and navy tones foster calmness, while rainbow details and glowing star lighting stimulate imagination.',
    '[
      {"name": "Sky Blue", "colorCode": "#5C93C4", "description": "Wall paneling, study chair, and tile patterns"},
      {"name": "Midnight Navy", "colorCode": "#1F2F4A", "description": "Starry night ceiling plane and textile accents"},
      {"name": "Cloud White & Light Oak", "colorCode": "#ECEEF0", "description": "Headboard silhouettes, study desk drawers, and shelving"},
      {"name": "Rainbow Arch Spectrum", "colorCode": "#E85D4E", "description": "Hand-painted decorative arch extending to bookshelf"}
    ]'::jsonb,
    '[
      {"name": "Quarter-Circle Geometric Motif Tiles", "brand": "Amtico (Lune Small-DC560)", "category": "flooring", "specifications": "300 x 300 mm ceramic tile, blue and white pattern", "price": "₹995 / sq.m"},
      {"name": "Fiber-Optic Starry Night Sky Ceiling", "category": "lighting", "specifications": "Dark navy false ceiling panel embedded with fiber-optic star points"},
      {"name": "Cloud-Shaped Bespoke Joinery", "category": "cabinetry", "specifications": "Curvilinear cloud headboard and study table drawers"},
      {"name": "Quarter-Round Arched Two-Tone Wardrobe", "category": "cabinetry", "specifications": "1000 x 600 x 2100 mm white & sky blue wardrobe with circular handle"}
    ]'::jsonb,
    '[
      {"item": "Single Bed with Wolf Coverlet", "brand": "Custom Woodwork", "dimensions": "1800 x 900 x 400 mm"},
      {"item": "Bedside Night Table", "brand": "Custom Woodwork", "dimensions": "400 x 350 x 450 mm"},
      {"item": "Kids Study Desk", "brand": "Custom Woodwork", "dimensions": "900 x 500 x 800 mm"},
      {"item": "Ergonomic Desk Chair", "brand": "Custom Seating", "dimensions": "400 x 400 x 800 mm (Sky Blue)"},
      {"item": "Cantilevered Rainbow Bookshelf", "brand": "Custom Woodwork", "dimensions": "1200 x 350 x 600 mm"},
      {"item": "Vitreous China Wash Basin", "brand": "Kohler", "model": "K-21226IN-SSO", "dimensions": "600 x 396 x 175 mm", "price": "₹22,300"},
      {"item": "Glass Shower Cubicle", "brand": "Jaquar", "model": "JSE-CHR-OPTSDR1520V", "dimensions": "900 x 900 x 2000 mm", "price": "₹32,500"},
      {"item": "Wall-Hung Water Closet (WC)", "brand": "Kohler", "model": "287801N0-0", "dimensions": "560 x 370 x 340 mm", "price": "₹19,760"}
    ]'::jsonb,
    '[
      "Playful 3D perspective elevation featuring rainbow arch leading to bookshelf",
      "Complete en-suite bathroom layout with Amtico tiles and Jaquar/Kohler sanitaryware",
      "Fiber-optic starry ceiling technical plan for ambient night-sky lighting",
      "Detailed kids furniture schedule covering bed, study unit, wardrobe, and storage"
    ]'::jsonb,
    '[
      "Specific age bracket for child room (e.g. toddler, primary school, or pre-teen)",
      "Any customized fabric patterns or paint brands used on site"
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    cover_image = EXCLUDED.cover_image,
    gallery_images = EXCLUDED.gallery_images,
    updated_at = NOW();
