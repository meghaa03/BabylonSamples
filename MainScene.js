import React, { Component } from 'react'
import { Engine, Model, Scene, ArcRotateCamera, HemisphericLight, EnvironmentHelper } from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core';
import Footer from './Footer';

export class MainScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            id: "before",
            model: ""
        }
        this.loadModel.bind(this);
    }

    renderModel = (rootURL) => {
        console.log("renderModel");
        this.setState({
            ...this.state,
            url: rootURL,
            id: "after"
        })
    }

    runXHR = (loadModel) => {
        var url = "path to my gltf model"
        var binaryString = "";
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (((xhr.status === 200) || (xhr.status == 0)) && (xhr.response)) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        binaryString = reader.result;
                        binaryString = binaryString.replace("application/octet-stream;", "");
                        loadModel(binaryString);
                    }
                    reader.readAsDataURL(xhr.response);
                }
            }
        }

        xhr.send(null);
    }

    loadModel = (base64_model_content) => {

        var raw_content = this._base64ToArrayBuffer(base64_model_content.replace("data:base64,", ""));
        var blob = new Blob([raw_content]);
        var url = URL.createObjectURL(blob);
        console.log(url);
        
        this.renderModel(url);

    }

    _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    render() {
        //console.log("render", this.state.url)
        return (
            <React.Fragment>
                <div className="mainScene">
                    <button onClick={() => this.runXHR(this.loadModel)}>Click</button>
                    <Engine antialias adaptToDeviceRatio canvasId="sample-canvas">
                        <Scene canvasId="scene_1">
                            {/* <ArcRotateCamera name="arc" target={new Vector3(0,-1 , 0)} minZ={0.001} alpha={(-Math.PI / 2) + 0.5}
                            beta={(0.5 + (Math.PI / 4))} radius={7} lowerBetaLimit={(Math.PI / 2) - 1.5}
                            upperBetaLimit={(Math.PI / 2)} lowerRadiusLimit={5} upperRadiusLimit={10} /> */}
                            <ArcRotateCamera name="arc" target={new Vector3(0, 1, 0)} minZ={0.001}
                                alpha={-Math.PI / 2} beta={(0.5 + (Math.PI / 4))} radius={5} lowerRadiusLimit={5} upperRadiusLimit={10} />
                            <HemisphericLight name='hemi' direction={new Vector3(0, -1, 0)} intensity={0.8} />
                            <Model
                                rotation={new Vector3(0, -15, 0)} key={this.state.id} position={new Vector3(0, 0, 0)}
                                rootUrl={this.state.url} sceneFilename=""
                                scaling={new Vector3(1, 1, 1)} />
                            <EnvironmentHelper options={{ enableGroundShadow: true, groundYBias: 1 }} mainColor={Color3.FromHexString("#74b9ff")} />
                        </Scene>
                    </Engine>
                </div>
                <div className="footer"><Footer renderModel={this.renderModel} /></div>
            </React.Fragment>
        )
    }
}

export default MainScene
