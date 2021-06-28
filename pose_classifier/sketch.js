let handpose;
let video;
let predictions = [];
let nn_obj;
let div_HANDPOSE;
let div_our_model;
let div_results


function setup() {
  createCanvas(640, 480);
  div_HANDPOSE = createElement('h6','HandPose Model Status: <b>LOADING...</b>');
  div_our_model = createElement('h6','Our Trained Model Status: <b>LOADING...</b>');
  div_results = createDiv('<h1> - </h1>\t\t\t confidence: -%');
  createDiv("<hr><input class='w3-button w3-green w3-border w3-round w3-margin' type='button' value='&#9750;  HOME PAGE' onclick=location.replace('../')>")
  video = createCapture(VIDEO);
  video.size(width, height);
  //alert('here');
  handpose = ml5.handpose(video, modelReady);
  nn_obj = ml5.neuralNetwork({
    inputs: 63,
    outputs: 5,
    task: 'classification',
    debug: true
  });
  //load_saved_ds();
  load_trained_model();

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    if (predictions.length > 0){
      //add_data_to_model_ds([""+current_key])
      classify_model(get_plain_array());
    
      
    }
  });
  //change_key();
  
  // Hide the video element, and just show the canvas
  video.hide();
}
function modelReady() {
  console.log("HandPose Model ready!");
  div_HANDPOSE.html("HandPose Model Status: <b><span style='color:green;'>READY!</span></b>");
  //load_trained_model();
}

function draw() {
  image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

/*function get_plain_array(){
  //createDiv(JSON.stringify(predictions[0]["annotations"]));
  //console.log(predictions[0]['annotations']);
  let arr = [];
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i].annotations;
    //console.log(prediction)
    let keys = Object.keys(prediction);
    for (let j = 0; j < keys.length; j += 1) {
      for (let k = 0; k < prediction[keys[j]].length; k += 1) {
        for (let l = 0; l < prediction[keys[j]][k].length; l += 1) {
          arr.push(prediction[keys[j]][k][l])
        }
      }
    }
    }
  return arr;
}*/
function get_plain_array(){
  //createDiv(JSON.stringify(predictions[0]["annotations"]));
  //console.log(predictions[0]['annotations']);
  let arr = [];
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i].landmarks;
    //console.log(prediction)
    for (let k = 0; k < prediction.length; k += 1) {
      for (let l = 0; l < prediction[k].length; l += 1) {
        arr.push(prediction[k][l])
      }
    }
    }
  return arr;
}

function load_trained_model(){
  nn_obj.load({
    model:'trained_data/model.json',
    metadata:'trained_data/model_meta.json',
    weights:'trained_data/model.weights.bin'
  },() => {
    console.log('TRAINED MODEL LOADED.');
    div_our_model.html("Our Trained Model Status: <b><span style='color:green;'>READY!</span></b>");
  })
}

function classify_model(inputs){
  nn_obj.classify(inputs, (error,results) => {
    console.log(results);
    display_results(results);
    console.log(error);
  })
}
function display_results(results){
  if (results[0].confidence*100 > 70){
    div_results.html('<h1>'+results[0].label+'</h1>\t\t\t confidence: '+(results[0].confidence*100)+'%')
  }
  else{
    div_results.html('<h1> - </h1>\t\t\t confidence: -%')
  }
  
}
