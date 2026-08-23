# Brain Wiki source ledger

This ledger separates material that directly shaped Mettlefield from material that was reviewed and left out. The source of truth is the local Brain Wiki under `PersonalAssistantV3/Brain Wiki`.

## Used in the product

| Brain Wiki source | What was taken from it | Where it appears |
| --- | --- | --- |
| `Assistant/20 Wiki/Tool Catalog.md` | Treat design libraries as references, verify licensing, preserve local-data behavior, and record rejected tools | Provider review, local-first storage, RepDB attribution, and this ledger |
| `Assistant/10 Sources/Notes/2026-08-01 Screenshot Intake Catalog.md` | OpenPencil, Open Codesign, Styleseed, Penpot, and privacy-first tools as design-system and critique leads | Formal type hierarchy, restrained color system, consistent spacing, and small reusable components |
| `Assistant/10 Sources/Notes/2026-08-21 Tools and Repositories Screenshot Session.md` | motion.dev and component-library references, plus the rule that a screenshot is not adoption evidence | Reduced-motion-aware route transitions and a deliberate decision not to import a showcase component kit |
| `F7D4B36A-ED2B-4537-ACB6-C1C3F3C35FF0_1_105_c.jpeg` in the Brain Wiki raw screenshots | A real-product style sheet with strict typography, color, spacing, and component rules | Archivo and IBM Plex Mono typography, limited teal palette, flat surfaces, visible grid lines, and consistent form controls |
| `Assistant/20 Wiki/Career/Career Evidence Bank.md` | Preserve defensible evidence and do not invent product metrics | README and future portfolio case study use shipped features and verified tests, not fictional adoption numbers |

## Added by the user during this rebuild

| Reference | Use |
| --- | --- |
| ReactBits screenshot | Set the quality bar for interaction, but no ReactBits component was copied or imported |
| Refero style screenshot | Reinforced the Brain Wiki's existing style-system reference and directly informed the restrained product language |
| openGym | Used as a product and data-architecture comparison for workout logging and exercise libraries |
| MyFitnessPal | Current first-party documentation informed diary speed, meal organization, frequent foods, and nutrition summaries |
| MacroFactor | Current first-party documentation informed weight trends, weekly review, fast logging, and adherence-neutral language |
| Original HealthCore source | The embedded common-food catalog and all 52 meal ideas were mechanically retained so the redesign did not discard useful product data |

## Reviewed and excluded

| Reference | Decision |
| --- | --- |
| ThreeUI | Reviewed but not used. Three-dimensional shaders and showcase effects do not improve the core logging tasks and would increase bundle and interaction cost. |
| anime.js | Not added. Motion already covers the brief route transitions needed here. |
| Kokonut UI | Not imported. Its catalog was treated as a component-quality reference only. |
| Pixel2Motion | Not used because generated or animated character art was rejected for this product. |
| Gym Visual media | Not used because repository access does not grant a separate downstream media license. |
| Generated avatar artwork | Not used. The user preferred real licensed exercise media and programmatic data visuals. |

## Exercise provider decision

RepDB was selected because its free-tier terms explicitly support use of the dataset and images with attribution. The app includes 400 normalized exercises, local image assets, searchable metadata, instructions, and provider credits. The repository interface keeps a future provider change isolated from the rest of the training feature.
