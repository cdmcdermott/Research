# Browser Fingerprinting Ontology

**Author**: Dr Christopher D. McDermott  
**Email**: c.d.mcdermott@rgu.ac.uk  
**License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
**Ontology IRI**: [`https://cdmcdermott.github.io/Research/NLDB_25/BrowserFingerprintingOntology`](https://cdmcdermott.github.io/Research/NLDB_25/BrowserFingerprintingOntology)  
**Namespace**: `https://cdmcdermott.github.io/Research/NLDB_25/BrowserFingerprintingOntology#`

---

## Description

The **Browser Fingerprinting Ontology** defines a structured vocabulary to describe and analyze the mechanisms, features, and attributes involved in browser fingerprinting techniques. It aims to support research and tool development related to privacy, tracking, and web security by modeling fingerprinting behavior in a machine-readable way.

---

## Core Concepts

The ontology includes the following key concepts:

### Classes
- `Website`: A domain or web page that may deploy fingerprinting scripts.
- `FingerprintingScript`: A script that collects information from browsers.
- `Attribute`: A specific property collected (e.g., screen resolution, timezone).
- `Feature`: A grouping of related attributes.
- `TrackingMechanism`: The technique used for identifying users (e.g., canvas, WebGL).
- `FingerprintingCategory`: Classification of fingerprinting behavior.
- Subclasses such as `BalancedAttribute`, `ImbalancedAttribute`, `SensitiveFeature`, `AggressiveFeature`.

### Object Properties
- `usesScript`, `requestsAttribute`, `belongsToFeature`, `hasTrackingMechanism`, etc.

### Data Properties
- Names, URLs, percentages, and boolean flags indicating sensitivity or aggressiveness.

---

## Example Usage

```turtle
:exampleWebsite a bf:Website ;
    bf:websiteURL "https://example.com" ;
    bf:usesScript :script1 .

:script1 a bf:FingerprintingScript ;
    bf:scriptName "canvasFingerprint.js" ;
    bf:requestsAttribute :canvasData ;
    bf:classifiedAs :aggressiveCategory .

:canvasData a bf:Attribute ;
    bf:attributeName "Canvas hash" ;
    bf:occurrencePercentage 87.3 .
```

---

## File Contents

- `BrowserFingerprintingOntology.owl`: The main ontology file in Turtle syntax.
- `README.md`: This file.

---

## Citation

If you use this ontology in your work, please cite our paper (coming soon)


---

## Contact

For feedback, collaboration, or questions:
**Email**: c.d.mcdermott@rgu.ac.uk  
**Affiliation**: School of Computing, Robert Gordon University
