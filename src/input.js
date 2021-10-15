import {
    TextField
} from '@mui/material';
import React, { Component } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Predictionary from 'predictionary';



const top100Films = [
    'hello',
    'test',
    'yay',
    'no',
    'helloworld',
    'hellodolly',
    'thi',
    'the'
];


export default class INP extends Component {
    inputRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            
            currVal: "",
            currWord: "",
            currPredArray: [],
            currPrediction: "",
            currPredPosition: 0,
            currValPrediction: "",

            currentCursorPos: 0,

            currMode: true,


        }
        this.updatePredIndex = this.scrollPredIndex.bind(this);
        this.updateCurrPrediction = this.updateCurrPrediction.bind(this);
        this.getPrediction = this.getPrediction.bind(this);
        this.getCurrWord = this.getCurrWord.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOnInput = this.handleOnInput.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
    }

    

    handleClearClick(){
        this.setState({currVal: ''})
    }

    handleOnInput(e){
        if(e !== ''){
            this.setState({currVal: e}, () => {
                let curr = this.getCurrWord();
                this.setState({currWord: curr}, () => {
                    this.getPrediction();
                });
            });
        }
        else{
            this.setState({currVal: e}, () => {
                this.setState({currPrediction: ''})
            });
        }
    }

    handleKeyDown = (e)  => {
        switch (e.keyCode) {
            case 8:
                this.setState({currWord: this.getCurrWord()}, () => {
                    if(this.state.currVal !== ''){
                        this.getPrediction();
                    }
                    else {
                        this.setState({currValPrediction: ''})
                    }
                });
                break;
            case 38:      // up arrow
                this.scrollPredIndex("up")
                break;
            
            case 39:      // right arrow
                // push prediction into input
                this.takePred();
                this.setState({currValPrediction: ''}, () => {
                    this.setState({currMode: false})
                });
                break;
            
            case 40:      // down arrow
                this.scrollPredIndex("down")
                break;
    
            case 188:     // ,
                this.setState({currMode: true}, () => {
                    this.setState({currentCursorPos: this.state.currentCursorPos+1});
                    this.setState({currValPrediction: ''})
                });
                break;
                
            case 187:     // =
                this.setState({currMode: false}, () => {
                    this.setState({currPrediction: ""});
                });
                break;
        
            default:
                break;
        }
      }



    // helper

    updateCurrPrediction(){
        this.setState({currPrediction: this.state.currPredArray[this.state.currPredPosition]}, () => {
            this.setCurrValPred();
        });
    }

    replaceCurrWordwithPred(){
            let curr = this.state.currVal;
            let word = this.state.currWord;
            let res = "";
            if(curr.includes(", ")){
                let r = curr.split(", ");
                console.log(r)
                r[this.state.currentCursorPos] = this.state.currPrediction;
                res = r.join(", ");
                console.log('has ,', res)
            }
            else {
                // only one
                res = curr.replace(word, this.state.currPrediction);
                console.log('has no ,', res)
            }
            //this.setState({currVal: res});
            return res;
    }

    setCurrValPred(){
        let e = this.replaceCurrWordwithPred();
        this.setState({currValPrediction: e});
    }

    takePred(){
        let a = this.replaceCurrWordwithPred();
        this.setState({currVal: a})
    }

    scrollPredIndex(mode){
        let preds = this.state.currPredArray;
        let currIndex = this.state.currPredPosition;
        if(preds.length >= 1){
            if(mode === "up"){
                if(currIndex >= 0){
                    if(currIndex === 0){
                        this.setState({currPredPosition: preds.length-1}, () => {
                            this.updateCurrPrediction();
                        });
                    }
                    else {
                        this.setState({currPredPosition: currIndex-1}, () => {
                            this.updateCurrPrediction();
                        });
                    }
                }
            }
            else if(mode === "down"){
                if(currIndex >= 0){
                    if(currIndex === preds.length-1){
                        this.setState({currPredPosition: 0}, () => {
                            this.updateCurrPrediction();
                        });
                    }
                    else {
                        this.setState({currPredPosition: currIndex+1}, () => {
                            this.updateCurrPrediction();
                        });
                    }
                }
            }
        }
        else {
            console.log('else');
        }
    }



    getPrediction(){
        if(this.state.currMode === true){
            let p = Predictionary.instance();
            p.addWords(top100Films);
            let res = p.predict(this.state.currWord);
            
            this.setState({currPredPosition: 0}, () => {
                this.setState({currPredArray: res}, () => {
                    this.updateCurrPrediction();
                });
            })

        }
    }

    // TODO
    getCurrWord(){
        let currVal = this.state.currVal;
        let mode = this.state.currMode
        let currW = "";
        if(currVal === ''){
            return "";
        }
        if(mode === true){
            if(currVal.includes(", ")){
                // mind. 1 oder mehr
                let arr = currVal.split(", ");
                currW = arr[arr.length-1];
            }
            else {
                // first
                currW = currVal;
            }
            return currW;
        }
        return "";
    }

    render() {
        return (
            <div className="App" style={{marginTop: 50, marginLeft: 20, width: 800}}>

              <span
                style={{color: '#CCCCCC', marginLeft: '14.15px', marginTop: '0.520em', position: 'absolute'}}
              >{this.state.currValPrediction}</span>
        
              <TextField
                    id="tet"
                    style={{width: 900}}
                    width={800}
                    size="small"
                    value={this.state.currVal}
                    inputRef={this.inputRef}
                    onKeyDown={e => this.handleKeyDown(e)}
                    onInput={e => this.handleOnInput(e.target.value)}
            
                    InputProps={{ 
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                        onClick={this.handleClearClick}
                        >
                        <ClearIcon/>
                        </IconButton>
                    </InputAdornment>,
                    }}
                    label="Search"
              >
            
              </TextField>
        
            </div>
          );
    }
}