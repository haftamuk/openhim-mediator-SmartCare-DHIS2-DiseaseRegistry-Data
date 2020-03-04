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
    dataValue.dataElement = 'Reset'
    dataValue.categoryOptionCombo = 'Reset'
    dataValue.value = 'Reset'
  });
}

router.use('/', function (req, res) {

  var current_data_element = "";
  /*
   / Get condition resources from SmartCare created on last 30 days
   / http://localhost:8089/Condition?onset-date=2020-02-01&_format=json
  */

  /*
  / Make http request to SmartCare
  / Returned result is in JSON format
  */

  /*
  / Iterate Over condition records
  / Use decission tree to populate values to DiseaseRegistryJSON
  */
 
  Object.values(conditionResources)[0].forEach(condition => {
    if (current_data_element === "") {
      /*
      / This is the first record
      / Update some elements of DiseaseRegistryJSON
      / Call Decission Tree to update the coresponding element of DiseaseRegistryJSON
      / Continue to iterate    
      */

    } else if (current_data_element === condition.resource.code.coding[0].code) {
      /*
      / Call Decission Tree to update the coresponding element of DiseaseRegistryJSON
      / Continue to iterate
      */
    } else {
      /*
          / Reset all elements of DiseaseRegistryJSON
         / Update some elements of DiseaseRegistryJSON
          / Call Decission Tree to update the coresponding element of DiseaseRegistryJSON
          / Continue to iterate    
          */
         resetDiseaseRegistryJSON();
    }

  });

  console.log(JSON.stringify(Object.values(DiseaseRegistryJSON)[0]));
  


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