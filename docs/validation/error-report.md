---
id: error-report
title: Validation report
platform_key: DOCS_VALIDATION_REPORT
---

This document is a comprehensive guide on understanding validation reports focusing specifically on various errors you might run into when validating your metadata. Whether you're a developer, designer, or simply curious about the intricacies of validation, this guide aims to provide you with valuable insights to enhance your understanding.

Validation report errors play a crucial role in maintaining data accuracy and system integrity. CancerModels.org - Validator provides users with various error codes that are generated to provide insights and to help user align their metadata with our data model. 

## Valid report

If your metadata submission passes the validation process, the report will be flagged as **valid**. A valid report means that all required fields have been correctly provided, and the values adhere to the expected formats and data types.

#### Summary of Valid Submission:
- **Data completeness**: All mandatory fields are present.
- **Data integrity**: Values comply with the required data types, formats, and permissible ranges.
- **Metadata alignment**: The provided metadata aligns with the data model in terms of schema structure and content.

When your metadata is valid, the system generates a **metadata score** to reflect how well the submission aligns with the required schema. This score is calculated based on the presence and validity of required and recommended fields, as well as the accuracy of the provided data. The score can vary based on model type (e.g., PDX, organoid, cell line) and reflects the overall quality of the metadata submission.

### Metadata Score Table:

| Model ID      | Model Type | Metadata Score | Missing Fields                                      |
| ------------- | ---------- | ------------------ | --------------------------------------------------- |
| CRC0014LM     | PDX        | 92                | None                                                |
| CRC0014LM_Cell| Cell Line  | 75                | patient.sex, model_validation.morphological_features |

#### How the Metadata Score is Calculated:
1. **Model Type**: Scores are calculated differently depending on whether the model is a PDX, organoid, or cell line. 
2. **Field Weights**: Each field has a specific weight assigned based on its importance. The more critical the field, the higher the impact on the score.
3. **Missing Fields**: If fields are missing or invalid, they are listed in the "Missing Fields" column, affecting the overall score.
   
A **100 score** indicates that all required fields are provided and valid, while lower scores highlight areas where the metadata could be improved.


## Invalid report

When your metadata submission fails the validation process, the report will be flagged as **invalid**. An invalid report indicates that one or more errors have been detected in the submitted metadata, which may hinder data accuracy and integrity.

#### Summary of Invalid Submission:
- **Missing Fields**: Required fields are not provided.
- **Data Type Errors**: Values do not conform to the expected data types.
- **Format Violations**: Submitted values fail to meet defined formatting requirements.

### Error types

| Error type | Error description   | Error resolution |
| ----------------------------------- | ------------------------------------------------------------------------------ |  --------- |
| **Missing required field**              | A required field is missing from the input data.                               | Ensure that all mandatory fields are provided before submitting the data. |
| **Invalid value type**                | The value provided for a specific field is of an incorrect data type.          | Verify that the data type matches the expected format. Please refer to the [dictionary](/dictionary). |
| **Invalid format**                      | The field's value does not comply with the defined regular expression pattern. | Review the regex pattern requirements and ensure the entered data adheres to the expected format. Refer to [REGEX errors](/docs/validation/error-report#invalid-format-error) |
| **Value not in allowed range**          | The field's value falls outside the acceptable range of values.                | Check the specified data range and adjust the input accordingly. |
| **Invalid by custom validation script** | A custom script or validation logic is applied to the field, and the script evaluates the provided value as invalid. | Examine the script logic for errors and ensure proper execution conditions are met. |
| **Value error**                         | The provided value/data does not match any of the allowed values.              | Cross-reference the provided value with the allowed options. Please refer to the [dictionary](/dictionary). |
| **Unrecognized field**                  | The submitted data has a field which is not in the schema.                     | Review the list of valid fields and remove any extraneous or irrelevant data. |

### Invalid format error

| Regular Expression type | Description of the Regular expression type                                                                                      | Regular Expression Pattern                                                                                                    |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Free text                | This regex allows a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%\>:;_/-&).               | ^[\\w\\d\\s\(\)\+\[\]\.',<\>%:;_\/\-&\]{0,250}$              |
| Description              | This regex allows a detailed description string of up to 1000 characters, comprising letters, digits, spaces, parentheses, and specific symbols (+.',<\>%:;_/-&). | ^[\\w\\d\\s\(\)\+.',<\>%:;_\\/\\-&]{0,1000}$             |
| URL                      | This regex allows a URL starting with 'http://' or 'https://' followed by domain names and optional path components.     | ^(http\|https)://[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,5}\(/[a-zA-Z0-9-._~:/%?#[\\]@!$&'()\*+,;=\]\*\)?$          |
| Alphanumeric             | This regex allows a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and hyphens.                                | ^[\\w\\d\\s/._~-]+$                                        |
| Email address            | This regex allows an email address or multiple separated by comma (,), or the strings 'Not Provided' or 'Not Collected'.   | ^(([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+,?\\s?)\*\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$ |
| Contact name             | This regex allows a contact name or multiple separated by comma (,).                                                  | ^[\\w\\s\\W]{0,250}$                                       |
| PMID                     | This regex allows a PubMed ID (PMID) in the format 'PMID: [ID], ' with optional whitespace.                            | ^(?:PMID:\\s?[0-9]{1,8},?\\s?)\*$                             |
| Numeric                  | This regex allows numeric values, including integers, ranges, or special values like 'All', 'Not Provided', or 'Not Collected' | ^([\\d\\s\\.,-\>?]+\|(A\|a)ll\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                  |
| Age                      | This regex allows age values, in 'months' as well or 'Not Provided' or 'Not Collected'.                                | ^([\\d\\s\\.,-]+(months)?\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                   |
| Collection event         | This regex allows string such as 'collection event ' followed by a numeric value eg. 'collection event 1', or 'Not Provided' or 'Not Collected'.                 | ^((c\|C)ollection\\sevent\\s[0-9]{1,3}\|\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$      |
| Collection date          | This regex allows a collection date in the format 'MMM YYYY' (e.g., Jan 2023), or special values like 'Not Provided' or 'Not Collected'.                       | ^([A-Za-z]{3}\\s[0-9]{4}\|(N\|n)ot (P\|p)rovided\|(N\|n)ot (C\|c)ollected)$                  |

### Value error

Some fields will only accept certain values from a list of controlled terminology that is provided in the permissible values column of the [dictionary](/dictionary) tables. Values must match the dictionary spelling exactly, but can be submitted case-insensitive.

#### patient
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| sex             | female, male, other, Not provided, Not collected   |
| ethnicity assessment method             | self-assessed, genetic, Not provided, Not collected |

#### patient_sample
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| tumour type      | primary, metastatic, recurrent, refractory, pre-malignant, Not provided, Not collected |
| sharable       | yes, no, Not provided, Not collected                |
| treatment_naive_at_collection       | yes, no, Not provided, Not collected                |
| treated_at_collection       | yes, no, Not provided, Not collected                |
| treated_prior_to_collection       | yes, no, Not provided, Not collected                |

#### sharing
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| accessibility   | academia, industry, academia and industry            |
| europdx access modality         | transnational access, collaboration only, Not applicable, Not provided, Not collected |

#### pdx_model
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| engraftment_type | heterotopic, orthotopic, Not provided, Not collected |

#### cell_model
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| type      | organoid, CRC, 3-D: other, 2D: other, cell line, Not provided, Not collected |
| growthproperties | embedded 3d culture, adherent, mix of adherent and suspension, suspension, Not provided, Not collected |
