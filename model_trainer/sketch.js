let handpose;
let video;
let predictions = [];
let nn_obj;
//let arr = [];
current_key = 0;
let div;


function setup() {
  //createCanvas(640, 480);
  div = createDiv('<h4>Training Status: <b>NOT TRAINING...</b></h4>');
  createDiv("epochs: <input id='epochs_number' value = 100 type=text/> <button type=button id='train_btn' onclick='traine_model_with_status();'>TRAIN MODEL</button><button type=button onclick=save_trained_model(); style='margin-left:5px;'>SAVE TRAINED MODEL</button>");
  createDiv("<hr><input class='w3-button w3-green w3-border w3-round w3-margin' type='button' value='&#9750;  HOME PAGE' onclick=location.replace('../')>")
  nn_obj = ml5.neuralNetwork({
    inputs: 63,
    outputs: 5,
    task: 'classification',
    debug: true
  });
}

function traine_model_with_status(){
  div.html('<h4>Training Status: <b>LOADING COLLECTED DATASET...</b></h4>');
  setTimeout(() => {
    load_saved_ds()
  },1000)
}
function load_saved_ds(){
 nn_obj.loadData('collected_json_dataset.json',() => {
    console.log('LOADED DATASET');
    div.html('<h4>Training Status: <b>DATASET LOADING COMPLETED...</b></h4>');
    setTimeout(() => {
      div.html('<h4>Training Status: <b>NORMALIZING DATASET...</b></h4>');
      setTimeout(() => {
        normalize_data();
        div.html('<h4>Training Status: <b>DATASET NORMALIZATION COMPLETED...</b></h4>');
        setTimeout(() => {
          div.html('<h4>Training Status: <b>TRAINING MODEL...</b></h4>');
          setTimeout(() => {
            train_model();
          },1000)
        },1000)
      },1000)
    },1000)
    //train_model();
  });
}
function train_model(){
  nn_obj.normalizeData();
  nn_obj.train({epochs:parseInt($('#epochs_number').val())},() => {
    console.log('MODEL TRAINED!')
    div.html('<h4>Training Status: <b>MODEL TRAINING COMPLETED...</b></h4>');
  })
}
function save_trained_model(){
  nn_obj.save();
}
function normalize_data(){
  nn_obj.normalizeData();
}