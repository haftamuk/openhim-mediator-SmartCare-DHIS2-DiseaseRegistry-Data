const express = require('express')
const medUtils = require('openhim-mediator-utils')
const mediatorConfig = require('../../config/mediator')

const winston = require('winston')

const utils = require('../utils')

var router = express.Router()

const DiseaseRegistryJSON = require('./DiseaseRegistryJSON')
const conditionResources = require('./MockConditionResources')

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
  console.log('=======================================================');
  console.log('condition.fullUrl ' + condition.fullUrl)
  console.log('condition.resource.resourceType ' + condition.resource.resourceType)
  console.log('condition.resource.id ' + condition.resource.id)
  console.log('condition.resource.identifier.system ' + condition.resource.identifier[0].system)
  console.log('condition.resource.identifier.value ' + condition.resource.identifier[0].value)
  console.log('condition.resource.code.coding.system ' + condition.resource.code.coding[0].system)
  console.log('condition.resource.code.coding.version ' + condition.resource.code.coding[0].version)
  console.log('condition.resource.code.coding.code ' + condition.resource.code.coding[0].code)
  console.log('condition.resource.subject.reference ' + condition.resource.subject.reference)
  console.log('condition.resource.onsetDateTime ' + condition.resource.onsetDateTime)
  console.log('=======================================================');
*/

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
router.use('/', function (req, res) {
  var current_data_element = "";
  /*
   / Get condition resources from SmartCare created on last 30 days
   / http://localhost:8089/Condition?onset-date=2020-02-01&_format=json
  / Returned result is in JSON format
  */

  /*
  / Iterate Over condition records
  */
  Object.values(conditionResources)[0].forEach(condition => {
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
      if (Object.values(conditionResources)[0][Object.values(conditionResources)[0].length - 1] === condition) {
        /*
        / push current DiseaseRegistryJSON data to DHIS2 as this is the last element
        */
        // TO-DO SEND DiseaseRegistryJSON TO DHIS2
        console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
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
      if (Object.values(conditionResources)[0][Object.values(conditionResources)[0].length - 1] === condition) {
        /*
        / push current DiseaseRegistryJSON data to DHIS2 as this is the last element
        */
        // TO-DO SEND DiseaseRegistryJSON TO DHIS2
        console.log('--------------------------------------------------------------------------------------')
        console.log('TO-DO SEND DiseaseRegistryJSON TO DHIS2')
        console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
        console.log('--------------------------------------------------------------------------------------')

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
      if (Object.values(conditionResources)[0][Object.values(conditionResources)[0].length - 1] === condition) {
        /*
        / push current DiseaseRegistryJSON data to DHIS2 as this is the last element
        */
        // TO-DO SEND DiseaseRegistryJSON TO DHIS2
        console.log('--------------------------------------------------------------------------------------')
        console.log('TO-DO SEND DiseaseRegistryJSON TO DHIS2')
        console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
        console.log('--------------------------------------------------------------------------------------')

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