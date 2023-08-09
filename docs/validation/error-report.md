---
id: error-report
title: Understanding validaion report
platform_key: DOCS_HOW_TO_USE
---
This document helps you understand the validatoion report and the error messages in order for you to be able to validate your metadata before submitting it to CancerModels.org.

## Error types

| Error type            | Error description                                                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Missing required field              | A required field is missing from the input data.                                                                     |
| Invalid value type                  | The value provided for a specific field is of an incorrect data type.                                                |
| Invalid format                      | The field's value does not comply with the defined regular expression pattern.                |
| Value not in allowed range          | The field's value falls outside the acceptable range of values.                                                    |
| Invalid by custom validation script | A custom script or validation logic is applied to the field, and the script evaluates the provided value as invalid. |
| Value error                         | The provided value/data does not match any of the allowed values.                                                    |
| Unrecognized field                  | The submitted data has a field which is not in the schema.                                                           |

## Field values

Some fields will only accept certain values from a list of controlled terminology that is provided in the permissible values column of the [dictionary](/dictionary) tables. Values must match the dictionary spelling exactly, but can be submitted case-insensitive.

Other fields must meet a regular expression for their value. Below you can find an explaination of each of the REGEX errors.

### Control vocabulary

### REGEX rules

| Regular Expression type         | Regular Expression Pattern                                                                                                          | Description of the Regular expressionn                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FREE_TEXT          | ^[\\w\\d\\s\(\)\+\[\]\.',<\>%:;_\/\-&\]{0,250}$                                          | This regex allows a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%\>:;_/-&).               |
| DETAIL_DESCRIPTION | ^[\\w\\d\\s\(\)\+.',<\>%:;_\\/\\-&]{0,1000}$                                                   | This regex allows a detailed description string of up to 1000 characters, comprising letters, digits, spaces, parentheses, and specific symbols (+.',<\>%:;_/-&). |
| URL                | ^(http\|https)://[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,5}\(/[a-zA-Z0-9-._~:/%?#[\\]@!$&'()\*+,;=\]\*\)?$             | This regex allows a URL starting with 'http://' or 'https://' followed by domain names and optional path components.                                             |
| URL_SAFE           | ^[\\w\\d\\s/._~-]+$                                                                                      | This regex allows a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and hyphens.                                |
| EMAIL              | ^(([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+,?\\s?)\*\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$ | This regex allows an email address or multiple separated by comma (,), or the strings 'Not Provided' or 'Not Collected'.                                          |
| CONTACT_NAME       | ^[\\w\\s\\W]{0,250}$                                                                                     | This regex allows a contact name or multiple separated by comma (,).                                                                                              |
| PMID_FORMAT        | ^(?:PMID:\\s?[0-9]{1,8},?\\s?)\*$                                                                          | This regex allows a PubMed ID (PMID) in the format 'PMID: [ID], ' with optional whitespace.                                                                       |
| NUMERIC            | ^([\\d\\s\\.,-\>?]+\|(A\|a)ll\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                                  | This regex allows numeric values, including integers, ranges, or special values like 'All', 'Not Provided', or 'Not Collected'                                    |
| AGE                | ^([\\d\\s\\.,-]+(months)?\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                                   | This regex allows age values, in 'months' as well or 'Not Provided' or 'Not Collected'.                                                                           |
| COLLECTION_EVENT   | ^((c\|C)ollection\\sevent\\s[0-9]{1,3}\|\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                        | This regex allows string such as 'collection event ' followed by a numeric value eg. 'collection event 1', or 'Not Provided' or 'Not Collected'.                  |
| COLLECTION_DATE    | ^([A-Za-z]{3}\\s[0-9]{4}\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                                        | This regex allows a collection date in the format 'MMM YYYY' (e.g., Jan 2023), or special values like 'Not Provided' or 'Not Collected'.                          |