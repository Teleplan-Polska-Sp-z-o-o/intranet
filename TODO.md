## DONE

SKY & Liberty (MAKE SURE THERE ARE COVERED setShift)

BUGS:

1. Adjusted the logic to properly catch time spans that belong to the employee's continuous shift, even if they extend beyond the expected shift boundaries.
2. Shift assignment now based on dominant continuous working time span instead of first data retrieval. Covers cases where operators worked outside standard shift times.

Common:

1. Unified components for charts.
2. Unified components for download.
3. Improved visibility of the "Considered" badge in file previews for better clarity.
4. Fixed date selection in transaction filters. Users can now only select dates that actually contain data, preventing confusion from empty results.

Liberty:

1. In the COSMETIC view, transaction retrieval now excludes records with part number CGA6444VF.
2. The export of the Overview table has been added to each view.
3. The SHIP view has been removed.
4. Moved efficiency calculation logic to backend only.

## DO

Common:

1. Accept one month in transaction filters (done in sky and liberty)

2. Wait for all matrix tt updates

Liberty:

1. Add new exception - hold tt & treat like COSMETICS_1

Ingenico:

1. Extend time spans to 30 mins for repairs l2 l3
2. exclude activation keyinjection and customisation

Lenovo

1. exclude packing and cleaning

rejestracja - utworzenie shop ordera lub utworzenie service requestu - najpeirw tworzy sie service req potem shop order

packing - moment zamkniecia shop orderu

repair - next dodac '1HL%' '1B%'

## BUGS

## THINGS TO CONSIDER
