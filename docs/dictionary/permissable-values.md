---
id: permissible-values
title: Permissible Values
platform_key: DOCS_Permissible_Values
---

- Some fields will only accept certain values from a list of controlled terminology that is provided in the permissible values column of the dictionary tables. Values must match the dictionary spelling exactly, but can be submitted case-insensitive. 
- Other fields must meet a regular expression for their value.


## patient
| Field             | Permissible values                                             |
|-------------------|----------------------------------------------------|
| patient_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| sex               | female, male, other, Not provided, Not collected   |
| history         | This field accepts a detailed description string of up to 1000 characters, comprising letters, digits, spaces, parentheses, and specific symbols (+.',
| ethnicity         | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| ethnicity_assessment_method | self-assessed, genetic, Not provided, Not collected |
| initial_diagnosis | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| age_at_initial_diagnosis                      | This field accepts age values (in 'months' as well).                                |

## patient_sample
| Field            | Permissible values                                             |
|------------------|----------------------------------------------------|
| patient_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| sample_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| collection_date          | This field accepts a collection date in the format 'MMM YYYY' (e.g., Jan 2023).                       |
| collection_event         | This field accepts string such as 'collection event ' followed by a numeric value eg. 'collection event 1'.                 |
| months_since_collection_1                  | This field accepts numeric values, including integers, ranges, or 'All'. |
| age_in_years_at_collection                      | This field accepts age values (in 'months' as well).                                |
| diagnosis        | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| tumour_type      | primary, metastatic, recurrent, refractory, pre-malignant, Not provided, Not collected |
| primary_site     | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| collection_site  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| stage            | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| staging_system   | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| grade            | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| grading_system    | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| virology_status  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| sharable         | yes, no, Not provided, Not collected                |
| treatment_naive_at_collection       | yes, no, Not provided, Not collected                |
| treated_at_collection       | yes, no, Not provided, Not collected                |
| treated_prior_to_collection       | yes, no, Not provided, Not collected                |
| model_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 


## sharing
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| model_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| accessibility   | academia, industry, academia and industry            |
| europdx_access_modality         | transnational access, collaboration only, Not applicable |
| email            | This field accepts an email address or multiple separated by comma (,).   |
| name             | This field accepts a contact name or multiple separated by comma (,).                                                  |
| form_url         | This field accepts a URL starting with 'http://' or 'https://'. |
| database_url     | This field accepts a URL starting with 'http://' or 'https://'. |

## pdx_model
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| model_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| engraftment_type | heterotopic, orthotopic, Not provided, Not collected |
| host_strain_name  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| host_strain_nomenclature  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| engraftment_site  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| sample_type  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| sample_state  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| passage_number                  | This field accepts numeric values, including integers, ranges, or 'All'. |
| publications                     | This field accepts a PubMed ID (PMID) in the format 'PMID: [ID], ' with optional whitespace.                            |

## model_validation
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| model_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| validation_technique  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| description         | This field accepts a detailed description string of up to 1000 characters, comprising letters, digits, spaces, parentheses, and specific symbols (+.',<\>%:;_/-&). |
| passages_tested                  | This field accepts numeric values, including integers, ranges, or 'All'. |
| validation_host_strain_nomenclature  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |



## cell_model
| Field           | Permissible values                                             |
|-----------------|----------------------------------------------------|
| model_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| name  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| type      | organoid, CRC, 3-D: other, 2D: other, cell line, Not provided, Not collected |
| growth_properties  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| parent_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| origin_patient_sample_id             | This field accepts a URL-safe string of characters, including letters, digits, spaces, slashes, periods, underscores, and 
| comments         | This field accepts a detailed description string of up to 1000 characters, comprising letters, digits, spaces, parentheses, and specific symbols (+.',<\>%:;_/-&). |
| supplier  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| external_ids  | This field accepts a free text string of up to 250 characters, including letters, digits, spaces, parentheses, and specific symbols (.',<%>:;_/-&). |
| publications                     | This field accepts a PubMed ID (PMID) in the format 'PMID: [ID], ' with optional whitespace.                            |

