import Content from "./Content";
import React from "react";

const ConsoleBody = (props) => {
    return (
        <div className="body">
            <Content
                editors={props.editors}
                onChangeMode={props.onChangeMode}
                onChangeText={props.onChangeText}
                onRemoveEditor={props.onRemoveEditor}
                onAddEditor={props.onAddEditor}
                onPlayClick={props.onPlayClick}
                onEditorClick={props.onEditorClick}
            />
        </div>
    );
};

export default ConsoleBody;