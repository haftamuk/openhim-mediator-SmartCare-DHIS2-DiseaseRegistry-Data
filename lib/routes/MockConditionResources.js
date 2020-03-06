var ConditionResources = [{
    fullUrl: "http://localhost:8089/Condition/2",
    resource: {
      resourceType: "Condition",
      id: "2",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "2"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "NEW123"
        }]
      },
      subject: {
        reference: "Patient/2"
      },
      onsetDateTime: "2020-02-27T11:56:36+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/3",
    resource: {
      resourceType: "Condition",
      id: "3",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "3"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "One"
        }]
      },
      subject: {
        reference: "Patient/3"
      },
      onsetDateTime: "2020-03-01T18:22:22+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/8",
    resource: {
      resourceType: "Condition",
      id: "8",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "8"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "one"
        }]
      },
      subject: {
        reference: "Patient/8"
      },
      onsetDateTime: "2020-03-01T18:22:38+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/1",
    resource: {
      resourceType: "Condition",
      id: "1",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "1"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "TEST1234"
        }]
      },
      subject: {
        reference: "Patient/1"
      },
      onsetDateTime: "2020-02-27T11:56:28+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/6",
    resource: {
      resourceType: "Condition",
      id: "6",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "6"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "three"
        }]
      },
      subject: {
        reference: "Patient/6"
      },
      onsetDateTime: "2020-03-01T18:22:32+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/4",
    resource: {
      resourceType: "Condition",
      id: "4",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "4"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "two"
        }]
      },
      subject: {
        reference: "Patient/4"
      },
      onsetDateTime: "2020-03-01T18:22:25+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/5",
    resource: {
      resourceType: "Condition",
      id: "5",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "5"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "two"
        }]
      },
      subject: {
        reference: "Patient/5"
      },
      onsetDateTime: "2020-03-01T18:22:29+03:00"
    }
  },
  {
    fullUrl: "http://localhost:8089/Condition/7",
    resource: {
      resourceType: "Condition",
      id: "7",
      identifier: [{
        system: "http://mu.edu.et/SmartCare",
        value: "7"
      }],
      code: {
        coding: [{
          system: "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
          version: "2017",
          code: "two"
        }]
      },
      subject: {
        reference: "Patient/7"
      },
      onsetDateTime: "2020-03-01T18:22:35+03:00"
    }
  }
];

/*
    console.log('===================== ' + i + ' ==================================');
    console.log(JSON.stringify(condition));
    console.log('-----------------------------------------------------');

    console.log('condition.fullUrl ' + condition.fullUrl)
    console.log('condition.resource.resourceType ' + condition.resource.resourceType)
    console.log('condition.resource.id ' + condition.resource.id)
    console.log('condition.resource.identifier.system '+ condition.resource.identifier[0].system)
    console.log('condition.resource.identifier.value '+ condition.resource.identifier[0].value)
    console.log('condition.resource.code.coding.system ' + condition.resource.code.coding[0].system)
    console.log('condition.resource.code.coding.version ' + condition.resource.code.coding[0].version)
    console.log('condition.resource.code.coding.code ' + condition.resource.code.coding[0].code)
    console.log('condition.resource.subject.reference ' + condition.resource.subject.reference)
    console.log('condition.resource.onsetDateTime ' + condition.resource.onsetDateTime )
    console.log('=======================================================');
*/
module.exports.conditionResources = ConditionResources;
