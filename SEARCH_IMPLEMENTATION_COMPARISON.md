# Meqasa Search Implementation Comparison

This document compares our search implementation with the live Meqasa site to ensure we're sending the same parameters and getting consistent results.

## Test Results from Live Site

Based on direct API testing with the live Meqasa API (https://meqasa.com), here are the baseline result counts:

| Test Scenario           | Parameters                                   | Result Count | URL                                         |
| ----------------------- | -------------------------------------------- | ------------ | ------------------------------------------- |
| **Basic Search**        | All properties for rent in Ghana             | **11,739**   | `/properties-for-rent-in-ghana`             |
| **Apartments**          | Filter by type: apartment                    | **6,150**    | `/properties-for-rent-in-ghana`             |
| **Houses**              | Filter by type: house                        | **4,227**    | `/properties-for-rent-in-ghana`             |
| **3 Bedrooms**          | Filter by bedrooms: 3                        | **3,439**    | `/properties-for-rent-in-ghana`             |
| **Accra Location**      | Location: Accra                              | **5,611**    | `/properties-for-rent-in-accra`             |
| **2 Bed Apts in Accra** | Type: apartment, Beds: 2, Location: Accra    | **1,503**    | `/properties-for-rent-in-accra`             |
| **Price Range**         | Min: 1000, Max: 5000                         | **1,331**    | `/properties-for-rent-in-ghana`             |
| **Furnished**           | Furnished only                               | **4,502**    | `/properties-for-rent-in-ghana`             |
| **Sale - Houses**       | Contract: sale, Type: house, Location: Accra | **3,694**    | `/properties-for-sale-in-accra`             |
| **Short-let Daily**     | Rent period: shortrent, Duration: daily      | **2,095**    | `/short-lease-properties-for-rent-in-ghana` |
| **Office Spaces**       | Type: office                                 | **634**      | `/properties-for-rent-in-ghana`             |
| **Price Sort**          | Sort: pricedown                              | **11,739**   | `/properties-for-rent-in-ghana`             |

## API Parameters Format

### Base Request Structure

**Method:** `POST`  
**Content-Type:** `application/x-www-form-urlencoded`

### URL Pattern

```
Regular searches:
https://meqasa.com/properties-for-{contract}-in-{locality}

Short-let searches:
https://meqasa.com/short-lease-properties-for-rent-in-{locality}
```

### POST Parameters

#### Required Parameters

- `app` - Always set to "vercel" (or your app identifier)

#### Optional Filter Parameters

| Parameter      | Description         | Valid Values                                                                                                                    | Example     |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `ftype`        | Property type       | apartment, house, office, warehouse, townhouse, shop, retail, commercial space, guest house, hotel, studio apartment, "- Any -" | `apartment` |
| `fbeds`        | Number of bedrooms  | 1, 2, 3, 4, 5, etc., "- Any -"                                                                                                  | `3`         |
| `fbaths`       | Number of bathrooms | 1+, 2+, 3+, etc., "- Any -"                                                                                                     | `2`         |
| `fmin`         | Minimum price (GHS) | Any positive number                                                                                                             | `1000`      |
| `fmax`         | Maximum price (GHS) | Any positive number                                                                                                             | `5000`      |
| `fisfurnished` | Furnished only      | "1" (yes) or omit                                                                                                               | `1`         |
| `ffsbo`        | For sale by owner   | "1" (yes) or omit                                                                                                               | `1`         |
| `frentperiod`  | Rent period         | shortrent, longrent, or omit                                                                                                    | `shortrent` |
| `fhowshort`    | Short-let duration  | daily, weekly, monthly, 3months, 6months                                                                                        | `daily`     |
| `fsort`        | Sort order          | newest, oldest, priceup, pricedown                                                                                              | `pricedown` |

#### Pagination Parameters (Load More)

- `y` - Search ID from initial search response
- `w` - Page number (1, 2, 3, etc.)

### Special Case: Short-let Properties

When searching for short-let properties:

1. Use the special endpoint: `/short-lease-properties-for-rent-in-{locality}`
2. **Always** set `frentperiod=shortrent`
3. **Always** set `ftype=- Any -` (property type filtering not supported for short-lets)
4. Optionally set `fhowshort` to filter by duration
5. Include all other standard filters (beds, baths, price, furnished, etc.)

**Example short-let request:**

```
POST /short-lease-properties-for-rent-in-ghana
Content-Type: application/x-www-form-urlencoded

app=vercel&frentperiod=shortrent&ftype=- Any -&fhowshort=daily&fbeds=2&fisfurnished=1
```

## Our Implementation

### Current API Route

`/api/properties` (GET or POST)

### GET Request Format

```
GET /api/properties?type=search&contract=rent&locality=ghana&ftype=apartment&fbeds=3&app=vercel
```

### POST Request Format

```json
{
  "type": "search",
  "params": {
    "contract": "rent",
    "locality": "ghana",
    "ftype": "apartment",
    "fbeds": "3",
    "app": "vercel"
  }
}
```

### Implementation Details

Our `/api/properties/route.ts` does the following:

1. **Accepts requests** via GET (query params) or POST (JSON body)
2. **Validates** contract type (rent/sale) and required fields
3. **Maps** property types if needed (e.g., "beach house" → "Beachhouse")
4. **Builds** the Meqasa API URL based on contract and locality
5. **Handles** short-let logic:
   - Detects short-let via `frentperiod=shortrent` or `fhowshort` presence
   - Switches to short-let endpoint
   - Forces `ftype=- Any -` for short-lets
6. **Forwards** all filter parameters to Meqasa API via POST
7. **Normalizes** the response (handles string/number resultcount)
8. **Returns** JSON response to client

### Parameter Mapping

```typescript
// Frontend → Backend mapping
const propertyTypeMap = {
  "beach house": "Beachhouse", // Only special case needed
};

// All other property types pass through as-is:
// apartment, house, office, warehouse, townhouse, shop, retail,
// commercial space, guest house, hotel, studio apartment
```

### Default Values

- If `ftype` is not provided, it's set to `"- Any -"`
- All numeric parameters (fbeds, fbaths, fmin, fmax) are validated and converted to strings
- Boolean filters (fisfurnished, ffsbo) only sent when value is "1"

## Verification Checklist

### ✅ Parameter Format

- [x] All parameters sent as POST body (URL-encoded)
- [x] Parameter names match exactly (ftype, fbeds, fbaths, fmin, fmax, etc.)
- [x] Parameter values are strings
- [x] Default `ftype=- Any -` when not specified
- [x] `app=vercel` always included

### ✅ Short-let Handling

- [x] Correct endpoint: `/short-lease-properties-for-rent-in-{locality}`
- [x] `frentperiod=shortrent` always set
- [x] `ftype=- Any -` forced for short-lets
- [x] `fhowshort` optional (shows all when omitted)
- [x] Other filters (beds, baths, price, furnished) still work

### ✅ Property Type Mapping

- [x] "beach house" → "Beachhouse"
- [x] All others pass through unchanged

### ✅ Validation

- [x] Contract type validated (rent or sale)
- [x] Locality required
- [x] Numeric values validated (fbeds, fbaths, fmin, fmax)
- [x] Sort option validated against allowed values
- [x] Rent period validated against allowed values

## Testing Instructions

### 1. Run Live Site Comparison

```bash
node test-search-comparison.cjs
```

This will:

- Make direct requests to live Meqasa API
- Show exact parameters being sent
- Display result counts for each scenario
- Provide URLs for manual verification

### 2. Test Local Implementation

```bash
# Start your dev server first
npm run dev

# In another terminal, run:
node test-local-search.cjs
```

This will:

- Make requests to your local /api/properties
- Compare result counts with live site
- Report any mismatches
- Show detailed comparison

### 3. Manual Browser Testing

For each test scenario:

1. **Open live site**: https://meqasa.com/properties-for-rent-in-ghana
2. **Apply filters** using the UI
3. **Note the result count** displayed
4. **Open DevTools** → Network tab
5. **Look for the POST request** to `/properties-for-rent-in-ghana`
6. **Examine the request payload** in the "Payload" tab
7. **Compare with your implementation**

### 4. Local Development Testing

In your application:

1. Navigate to `/search/rent?q=ghana`
2. Apply the same filters
3. Check the Network tab for your `/api/properties` request
4. Verify parameters match the live site
5. Compare result counts

## Common Issues to Check

### ❌ Result Count Mismatches

If counts don't match:

1. Check parameter names (case-sensitive: `fbeds` not `fBeds`)
2. Verify parameter values (strings not numbers)
3. Ensure `ftype=- Any -` when no type selected
4. Check for extra/missing parameters
5. Verify short-let detection logic

### ❌ Short-let Issues

If short-let searches fail:

1. Confirm using short-let endpoint
2. Check `frentperiod=shortrent` is set
3. Verify `ftype=- Any -` (not user's selection)
4. Ensure `fhowshort` is optional

### ❌ Parameter Format Issues

If API returns errors:

1. Verify POST method (not GET to Meqasa)
2. Check Content-Type: `application/x-www-form-urlencoded`
3. Ensure body is URL-encoded string, not JSON
4. Validate parameter value types (all strings)

## Expected Behavior

### Successful Search Response

```json
{
  "results": [...],           // Array of properties (16 per page)
  "resultcount": 11739,       // Total matching properties
  "searchid": 702166485,      // ID for pagination
  "searchdesc": "properties for...",
  "topads": [...],            // Top advertisements
  "bottomads": [...],         // Bottom advertisements
  "project1": {...},          // Featured project 1
  "project2": {...}           // Featured project 2
}
```

### Load More (Pagination)

```
POST /properties-for-rent-in-ghana
Body: y=702166485&w=2&app=vercel&[...original search filters]
```

- `y` = search ID from initial response
- `w` = page number (2, 3, 4, etc.)
- Include ALL original search filters

## Implementation Status

✅ **Complete**: Our implementation correctly:

- Sends parameters in the right format
- Uses correct endpoints for regular and short-let searches
- Handles property type mapping
- Validates all inputs
- Preserves filters during pagination
- Returns properly normalized responses

🔍 **To Verify**: Run the test scripts to confirm result counts match

## Sample Requests

### Example 1: Basic Search

```
POST https://meqasa.com/properties-for-rent-in-ghana
Content-Type: application/x-www-form-urlencoded

app=vercel&ftype=- Any -
```

**Expected**: 11,739 results

### Example 2: Filtered Search

```
POST https://meqasa.com/properties-for-rent-in-accra
Content-Type: application/x-www-form-urlencoded

app=vercel&ftype=apartment&fbeds=2
```

**Expected**: 1,503 results

### Example 3: Short-let Search

```
POST https://meqasa.com/short-lease-properties-for-rent-in-ghana
Content-Type: application/x-www-form-urlencoded

app=vercel&frentperiod=shortrent&ftype=- Any -&fhowshort=daily
```

**Expected**: 2,095 results

## Conclusion

Our implementation is designed to match the live Meqasa site exactly. The test scripts provided will help verify that:

1. ✅ Parameters are sent in the correct format
2. ✅ The same data structure is used
3. ✅ Result counts match for all scenarios
4. ✅ Special cases (short-let, property mapping) work correctly
5. ✅ Pagination preserves all filters

Run the tests and review any mismatches to ensure 100% compatibility with the live site.
