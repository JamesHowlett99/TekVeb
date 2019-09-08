import React from "react";
import {Controlled as CodeMirror} from "react-codemirror2";

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.instance = null;
    }
    render() {
        return (
            <div
                className={"editor" + (this.props.mode === 'markdown' ? ' day' : ' night')}
                ref={node => this.node = node}
            >
                <div className={"code-block"}
                     style={{display: this.props.mode === 'markdown' ? (this.props.show ? null : "none") : null}}
                     onClick={() => {
                         this.props.onEditorClick()
                     }}>
                    <CodeMirror
                        className="code-mirror"
                        value={this.props.text}
                        options={{
                            mode: this.props.mode,
                            theme: this.props.mode === 'markdown' ? '3024-day' : '3024-night',
                            lineNumbers: true
                        }}
                        onBeforeChange={(editor, data, value) => {
                            this.props.changeText(value);
                        }}
                        editorDidMount={editor => { this.instance = editor }}
                        onChange={(editor, data, value) => {
                        }}
                    />
                </div>
                <div className="output-block"
                     style={{display: this.props.mode === 'markdown' ? (!this.props.show ? null : "none") : null}}
                     onDoubleClick={() => {
                         this.props.onEditorClick();
                     }}
                >
                    {this.props.mode === 'markdown' ? this.props.output : <pre>{this.props.output}</pre>}
                </div>
                <div className={"options-block"} style={{display: this.props.show ? "" : "none"}}>
                    <div className="item left">
                        <pre>
                            <b style={{color: "cadetblue"}}>Current Mode: </b>{this.props.mode}
                        </pre>
                    </div>
                    <div className="item">
                        <button
                            onClick={() => {
                                this.props.changeMode("python")
                            }}
                        >
                            python
                        </button>
                        <button
                            onClick={() => {
                                this.props.changeMode("markdown")
                            }}
                        >
                            markdown
                        </button>
                    </div>
                    <div className="item" style={{display: this.props.mode === 'markdown' ? "none" : null}}>
                        <button onClick={this.props.onPlayClick}><i className="fas fa-play"> </i></button>
                    </div>
                    <div className="item">
                        <button onClick={this.props.onMinusClick}><i className="fas fa-minus"> </i></button>
                    </div>
                    <div className="item">
                        <button onClick={this.props.onPlusClick}><i className="fas fa-plus"> </i></button>
                    </div>
                </div>
            </div>
        );
    }
}