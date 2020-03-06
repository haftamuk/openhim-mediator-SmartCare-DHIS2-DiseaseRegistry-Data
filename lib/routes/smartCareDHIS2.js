const express = require('express')
const medUtils = require('openhim-mediator-utils')
const mediatorConfig = require('../../config/mediator')
var request = require('requestretry')

const winston = require('winston')

const utils = require('../utils')

var router = express.Router()

const DiseaseRegistryJSON = require('./DiseaseRegistryJSON')
var conditionResources = [];

/*
/ Reset dynamic values of DiseaseRegistryJSON
*/
function resetDiseaseRegistryJSON() {
  DiseaseRegistryJSON.DiseaseRegistryJSON.dataValues.forEach(dataValue => {
    dataValue.value = 0
  });
}

/*
/ Update Value of DiseaseRegistryJSON element for a given categoryOptionCombo
*/
function UpdateValue(categoryOptionCombo) {
  DiseaseRegistryJSON.DiseaseRegistryJSON.dataValues.forEach(dataValue => {
    if (dataValue.categoryOptionCombo === categoryOptionCombo) {
      dataValue.value = parseInt(dataValue.value) + 1
    }
  });
}

/*
/ Update Value of DiseaseRegistryJSON element for a given categoryOptionCombo
*/
function UpdateDataElement(dataElement) {
  DiseaseRegistryJSON.DiseaseRegistryJSON.dataValues.forEach(dataValue => {
    dataValue.dataElement = dataElement
  });
}


function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


/*
/ 
*/
function updateDiseaseRegistryJSON(condition) {
  /*
  / Get patient resource using condition.resource.subject.reference
  */
  var patientJSON = {
    resourceType: "Patient",
    identifier: [{
      system: "http://mu.edu.et/SmartCare",
      value: "1"
    }],
    gender: "male",
    birthDate: "2010-03-05"
  }

  if (patientJSON.gender === 'male') {
    // < 1 year, Male
    // https://dhis.moh.gov.et/api/categoryOptionCombos/OfFSKnXhaBU
    if (getAge(patientJSON.birthDate) < 1) {
      UpdateValue("OfFSKnXhaBU")
    }
    // Male, 1 - 4 years
    // https://dhis.moh.gov.et/api/categoryOptionCombos/ZDTa17hJpOB
    else if (getAge(patientJSON.birthDate) > 1 && getAge(patientJSON.birthDate) < 4) {
      UpdateValue("ZDTa17hJpOB")
    }
    // Male, 5 - 14 years
    // https://dhis.moh.gov.et/api/categoryOptionCombos/UWUZ8Tr6h0m
    else if (getAge(patientJSON.birthDate) > 5 && getAge(patientJSON.birthDate) < 14) {
      UpdateValue("UWUZ8Tr6h0m")
    }
    // 15 - 29 years, Male
    // https://dhis.moh.gov.et/api/categoryOptionCombos/CYNJysr5r93
    else if (getAge(patientJSON.birthDate) > 15 && getAge(patientJSON.birthDate) < 29) {
      UpdateValue("CYNJysr5r93")
    }
    // Male, 30 - 64 years
    // https://dhis.moh.gov.et/api/categoryOptionCombos/WrECL06zVeA
    else if (getAge(patientJSON.birthDate) > 30 && getAge(patientJSON.birthDate) < 64) {
      UpdateValue("WrECL06zVeA")
    }
    // Male, >=65 yr
    // https://dhis.moh.gov.et/api/categoryOptionCombos/aQNfi3OSCJB
    else if (getAge(patientJSON.birthDate) >= 65) {
      UpdateValue("aQNfi3OSCJB")
    }
  } else if (patientJSON.gender === 'female') {
    // < 1 year, Female 
    // https://dhis.moh.gov.et/api/categoryOptionCombos/c320cNK3wFH
    if (getAge(patientJSON.birthDate) < 1) {
      UpdateValue("c320cNK3wFH")
    }
    // Female, 1 - 4 years
    // https://dhis.moh.gov.et/api/categoryOptionCombos/X8QpQ0AUa9g
    else if (getAge(patientJSON.birthDate) > 1 && getAge(patientJSON.birthDate) < 4) {
      UpdateValue("X8QpQ0AUa9g")
    }
    // Female, 5 - 14 years
    // https://dhis.moh.gov.et/api/categoryOptionCombos/BwqbjDm3hhY
    else if (getAge(patientJSON.birthDate) > 5 && getAge(patientJSON.birthDate) < 14) {
      UpdateValue("BwqbjDm3hhY")
    }
    // 15 - 29 years, Female
    // https://dhis.moh.gov.et/api/categoryOptionCombos/sOvBOGZBqa1
    else if (getAge(patientJSON.birthDate) > 15 && getAge(patientJSON.birthDate) < 29) {
      UpdateValue("sOvBOGZBqa1")
    }
    // Female, 30 - 64 years
    // https://dhis.moh.gov.et/api/categoryOptionCombos/rUK6L6E2Toz
    else if (getAge(patientJSON.birthDate) > 30 && getAge(patientJSON.birthDate) < 64) {
      UpdateValue("rUK6L6E2Toz")
    }
    // Female, >=65 yr
    // https://dhis.moh.gov.et/api/categoryOptionCombos/TnOFX5D5Qjo
    else if (getAge(patientJSON.birthDate) >= 65) {
      UpdateValue("TnOFX5D5Qjo")
    }
  } else {
    console.log('Gender not specified')
  }
}

function sendDataToDHIS2(datasetSummary) {
  console.log('========================================================================================================')
  console.log('Sending to DHIS2')
  options = {
    url: 'https://dhis.moh.gov.et/api/dataValueSets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Request',
      'X-platform': 'Node'
    },
    auth: {
      username: '',
      password: ''
    },    
    body: JSON.stringify(datasetSummary),
    // The below parameters are specific to request-retry
    maxAttempts: 10, // (default) try 5 times
    retryDelay: 5000, // (default) wait for 5s before trying again
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors

  }
  
  
  request( options ,
    (error, res, body) => {
      if (error) {
        console.log('=== ON ERROR ===')
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
    }
  )
  console.log('========================================================================================================')
}

router.use('/', function (req, res, next) {
  var api = 'http://localhost:8089/Condition?onset-date=2020-02-01&_format=json';

  const options = {
    url: api,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Request',
      'X-platform': 'Node'
    },
    // The below parameters are specific to request-retry
    maxAttempts: 10, // (default) try 5 times
    retryDelay: 5000, // (default) wait for 5s before trying again
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors

  }

  // [{"fullUrl":"http://localhost:8089/Condition/2","resource":{"resourceType":"Condition","id":"2","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"2"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"NEW123"}]},"subject":{"reference":"Patient/2"},"onsetDateTime":"2020-02-27T11:56:36+03:00"}},{"fullUrl":"http://localhost:8089/Condition/3","resource":{"resourceType":"Condition","id":"3","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"3"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"One"}]},"subject":{"reference":"Patient/3"},"onsetDateTime":"2020-03-01T18:22:22+03:00"}},{"fullUrl":"http://localhost:8089/Condition/8","resource":{"resourceType":"Condition","id":"8","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"8"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"one"}]},"subject":{"reference":"Patient/8"},"onsetDateTime":"2020-03-01T18:22:38+03:00"}},{"fullUrl":"http://localhost:8089/Condition/1","resource":{"resourceType":"Condition","id":"1","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"1"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"TEST1234"}]},"subject":{"reference":"Patient/1"},"onsetDateTime":"2020-02-27T11:56:28+03:00"}},{"fullUrl":"http://localhost:8089/Condition/6","resource":{"resourceType":"Condition","id":"6","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"6"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"three"}]},"subject":{"reference":"Patient/6"},"onsetDateTime":"2020-03-01T18:22:32+03:00"}},{"fullUrl":"http://localhost:8089/Condition/4","resource":{"resourceType":"Condition","id":"4","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"4"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"two"}]},"subject":{"reference":"Patient/4"},"onsetDateTime":"2020-03-01T18:22:25+03:00"}},{"fullUrl":"http://localhost:8089/Condition/5","resource":{"resourceType":"Condition","id":"5","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"5"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"two"}]},"subject":{"reference":"Patient/5"},"onsetDateTime":"2020-03-01T18:22:29+03:00"}},{"fullUrl":"http://localhost:8089/Condition/7","resource":{"resourceType":"Condition","id":"7","identifier":[{"system":"http://mu.edu.et/SmartCare","value":"7"}],"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2017","code":"two"}]},"subject":{"reference":"Patient/7"},"onsetDateTime":"2020-03-01T18:22:35+03:00"}}]

  request(options, (err, res, body) => {
    // this callback will only be called when the request succeeded or after maxAttempts or on err
    if (err) {
      console.log('Problem communicating to SmartCare')
    } else {
      if (res) {
        console.log('The number of request attempts: ' + res.attempts)
      }

      body = JSON.parse(body);
      conditionResources = body.entry;
      next();
    }
  })

});
router.use('/', function (req, res, next) {
  var current_data_element = "";
  /*
   / Get condition resources from SmartCare created on last 30 days
   / http://localhost:8089/Condition?onset-date=2020-02-01&_format=json
  / Returned result is in JSON format
  */

  /*
  / Iterate Over condition records
  */
  //  conditionResources = conditionResources.entry;
  Object.values(conditionResources).forEach(condition => {

    if (current_data_element === "") {
      current_data_element = condition.resource.code.coding[0].code;
      /*
      / This is the first record
      / Update some elements of DiseaseRegistryJSON
      / TO-DO  A lookup table is used to resolve condition.resource.code.coding[0].code to DHIS2 data element id
      */
      UpdateDataElement(condition.resource.code.coding[0].code)

      /*
      / Call Decission Tree to update the coresponding element of DiseaseRegistryJSON
      */
      updateDiseaseRegistryJSON(condition);
      /*
      / Check if this is the last element
      */
      if (Object.values(conditionResources)[Object.values(conditionResources).length - 1] === condition) {
        /*
        / push current DiseaseRegistryJSON data to DHIS2 as this is the last element
        */
        // TO-DO SEND DiseaseRegistryJSON TO DHIS2
        console.log('--------------------------------------------------------------------------------------')
        console.log('TO-DO SEND DiseaseRegistryJSON TO DHIS2')
        console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
        console.log('--------------------------------------------------------------------------------------')
        sendDataToDHIS2(Object.values(DiseaseRegistryJSON)[0])
        current_data_element = "";
        resetDiseaseRegistryJSON();
        next();
      }
      /*
      / Continue to iterate
      */

    } else if (current_data_element === condition.resource.code.coding[0].code) {
      /*
      / Call Decission Tree to update the coresponding elements of DiseaseRegistryJSON
      / Continue to iterate
      */
      updateDiseaseRegistryJSON(condition);
      /*
      / Check if this is the last element
      */
      if (Object.values(conditionResources)[Object.values(conditionResources).length - 1] === condition) {
        /*
        / push current DiseaseRegistryJSON data to DHIS2 as this is the last element
        */
        // TO-DO SEND DiseaseRegistryJSON TO DHIS2
        console.log('--------------------------------------------------------------------------------------')
        console.log('TO-DO SEND DiseaseRegistryJSON TO DHIS2')
        console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
        console.log('--------------------------------------------------------------------------------------')
        sendDataToDHIS2(Object.values(DiseaseRegistryJSON)[0])
        current_data_element = "";
        resetDiseaseRegistryJSON();
        next();
      }
    } else {
      /*
      / push current DiseaseRegistryJSON data to DHIS2
      / Reset all elements of DiseaseRegistryJSON
      / Update some elements of DiseaseRegistryJSON
      / Call Decission Tree to update the coresponding element of DiseaseRegistryJSON
      / Continue to iterate    
      */
      // TO-DO SEND DiseaseRegistryJSON TO DHIS2
      console.log('--------------------------------------------------------------------------------------')
      console.log('TO-DO SEND DiseaseRegistryJSON TO DHIS2')
      console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
      console.log('--------------------------------------------------------------------------------------')

      resetDiseaseRegistryJSON();
      current_data_element = condition.resource.code.coding[0].code;
      UpdateDataElement(condition.resource.code.coding[0].code)
      updateDiseaseRegistryJSON(condition);
      /*
      / Check if this is the last element
      */
      if (Object.values(conditionResources)[Object.values(conditionResources).length - 1] === condition) {
        /*
        / push current DiseaseRegistryJSON data to DHIS2 as this is the last element
        */
        // TO-DO SEND DiseaseRegistryJSON TO DHIS2
        console.log('--------------------------------------------------------------------------------------')
        console.log('TO-DO SEND DiseaseRegistryJSON TO DHIS2')
        console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
        console.log('--------------------------------------------------------------------------------------')
        current_data_element = "";
        resetDiseaseRegistryJSON();
        next();
      }
    }

  });

})



router.get('/', function (req, res) {
  winston.info(`Processing ${req.method} request on ${req.url}`)
  var responseBody = 'Primary Route FROM IMPLEMENTATION'
  var headers = {
    'content-type': 'application/json'
  }

  // add logic to alter the request here

  // capture orchestration data
  var orchestrationResponse = {
    statusCode: 200,
    headers: headers
  }
  let orchestrations = []
  orchestrations.push(utils.buildOrchestration('Primary Route', new Date().getTime(), req.method, req.url, req.headers, req.body, orchestrationResponse, responseBody))

  // set content type header so that OpenHIM knows how to handle the response
  res.set('Content-Type', 'application/json+openhim')

  // construct return object
  var properties = {
    property: 'Primary Route'
  }
  res.send(utils.buildReturnObject(mediatorConfig.urn, 'Successful', 200, headers, responseBody, orchestrations, properties))

})

module.exports = router