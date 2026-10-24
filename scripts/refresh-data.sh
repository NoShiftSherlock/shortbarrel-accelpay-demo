#!/usr/bin/env bash
# Re-pull the real retailer rows behind data.js. Needs bq-cli with ADC.
set -euo pipefail
export GOOGLE_CLOUD_PROJECT="${GOOGLE_CLOUD_PROJECT:-application-247917}"
bq-cli query --limit 2000 "
SELECT r.name AS retailer, JSON_EXTRACT_SCALAR(r.address,'\$.city') AS city,
       JSON_EXTRACT_SCALAR(r.address,'\$.state') AS state, v.name, v.upc, v.price, v.stock
FROM \`application-247917.liquidcommerce_mongo_retailer.variants\` v
JOIN \`application-247917.liquidcommerce_mongo_retailer.retailers\` r ON r._id = v.retailer
WHERE REGEXP_CONTAINS(LOWER(CONCAT(IFNULL(v.name,''),' ',IFNULL(v.brand,''))), r'short ?barrel|old fourth|o4d')
  AND v.active AND v.stock > 0 AND v.stock < 9000
  AND COALESCE(r.is_gopuff, FALSE) = FALSE AND COALESCE(r.is_test, FALSE) = FALSE
  AND COALESCE(r.is_active, TRUE) = TRUE
ORDER BY state, v.name, v.price"
# Then drop the three retailers excluded on purpose, check the retailer inventory
# sheets (alcohol-coverage skill), and rerun the live Gopuff brand-facet sweep.
