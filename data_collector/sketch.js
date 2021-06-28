let handpose;
let video;
let predictions = [];
let nn_obj;
//let arr = [];
current_key = 0;
let div;
let collecting_data = false;


function setup() {
  createCanvas(640, 480);
  div_HANDPOSE = createDiv('<h6>HandPose Model Status: <b>LOADING...</b></h6>');
  div = createDiv('<h4>Data Collection Status :<b>NOT COLLECTING...</b></h4>');
  createDiv("key: <input id='input_key' type=text/> <button type=button id='collect_btn' onclick=collect_data();>COLLECT</button><button type=button onclick=save_model_ds(); style='margin-left:5px;'>SAVE DATA</button>");
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
  //load_trained_model();

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    if (predictions.length > 0){
      if (collecting_data){
        add_data_to_model_ds([$('#input_key').val()])
      }
      //add_data_to_model_ds([""+current_key])
      //classify_model(get_plain_array());
    
      
    }
  });
  //change_key();
  
  // Hide the video element, and just show the canvas
  video.hide();
}
function modelReady() {
  console.log("HandPose Model ready!");
  div_HANDPOSE.html("<h6>HandPose Model Status: <b><span style='color:green;'>READY!</span></b></h6>");
  
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
  createDiv(JSON.stringify(predictions[0]));
  //console.log(predictions[0]['annotations']);
  let arr = [];
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i].landmarks;
    //console.log(prediction)
    for (let k = 0; k < prediction.length; k += 1) {
      for (let l = 0; l < prediction[k].length; l += 1) {
        arr.push(prediction[k][l]);
      }
    }
    }
  return arr;
}

function add_data_to_model_ds(key){
  let plain_array = get_plain_array();
  nn_obj.addData(plain_array,key);
}
function save_model_ds(){
  nn_obj.saveData();
}
function collect_data(){
  if ($('#input_key').val() != '')
  {
    if ($('#collect_btn').text() == 'COLLECT' || $('#collect_btn').text() == 'RESUME')
    {
      collecting_data = true;
      div.html("<h4>Data Collection Status: <b><span style='color:blue'>COLLECTING...</span></b></h4>")
      $('#collect_btn').text('PAUSE')
    }
    else{
      collecting_data = false;
      div.html("<h4>Data Collection Status: <b><span style='color:red'>NOT COLLECTING...</span></b></h4>")
      $('#collect_btn').text('RESUME');
    }
  }
  else{
    div.html("<h4>Data Collection Status: <b>NOT COLLECTING...</b><span style='color:red'> (enter a key bellow)</span></h4>")
  }
}
