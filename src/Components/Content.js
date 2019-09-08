import React from "react";
import OutsideAlerter from "./OutsideAlerter";
import ReactMarkdown from "react-markdown";
import Editor from "./Editor";

export default class Content extends React.Component {
    render() {
        return (
            <OutsideAlerter onOutSideClick={() => {
                this.props.onEditorClick(-1)
            }}>
                <div className="content">
                    {
                        this.props.editors.map((editor, index) => {
                            return (
                                <Editor
                                    key={index}
                                    text={editor.text}
                                    mode={editor.mode}
                                    show={editor.show}
                                    output={editor.mode === 'markdown' ?
                                        <ReactMarkdown source={editor.text}/> : editor.output}
                                    changeMode={(mode) => {
                                        this.props.onChangeMode(mode, index);
                                    }}
                                    changeText={(text) => {
                                        this.props.onChangeText(text, index);
                                    }}
                                    onMinusClick={() => {
                                        this.props.onRemoveEditor(index);
                                    }}
                                    onPlusClick={() => {
                                        this.props.onAddEditor(index);
                                    }}
                                    onPlayClick={() => {
                                        this.props.onPlayClick(index);
                                    }}
                                    onEditorClick={() => {
                                        this.props.onEditorClick(index);
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </OutsideAlerter>
        );
    }
}
