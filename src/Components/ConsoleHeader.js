import React from "react";
import OutsideAlerter from "./OutsideAlerter";
import vebPyLogo from "../Assets/images/vebpy.png";
import Title from "./Title";

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    onUploadChange(e) {
        this.setState({
            open: false
        });
        let input = e.target;
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.props.onUploadClick(text);
        };
        reader.readAsText(input.files[0]);
    }

    render() {
        return (
            <div className="main-menu">
                <button onClick={this.props.onNewDocumentClick}><i className="fas fa-file-alt"> </i></button>
                <OutsideAlerter onOutSideClick={() => {
                    this.setState({
                        open: false
                    });
                }}>
                    {
                        this.state.open ?
                            <input type="file" onChange={(e) => {
                                this.onUploadChange(e)
                            }}/> : <button onClick={() => {
                                this.setState({
                                    open: true
                                });
                            }}><i className="fas fa-upload"> </i></button>
                    }
                </OutsideAlerter>
                <button onClick={this.props.onDownloadClick}><i className="fas fa-download"> </i></button>
                <button onClick={this.props.onLogoutClick}><i className="fas fa-sign-out-alt"> </i></button>
            </div>
        );
    }
}

const ConsoleHeader = (props) => {
    return (
        <div className="header">
            <div className="logo">
                <img src={vebPyLogo} alt="VebPyLogo"/>
            </div>
            <div className="nav-bar">
                <Title title={props.title} onTitleUpdate={props.onTitleUpdate}/>
                <MainMenu
                    onNewDocumentClick={props.onNewDocumentClick}
                    onUploadClick={props.onUploadClick}
                    onDownloadClick={props.onDownloadClick}
                    onLogoutClick={props.onLogoutClick}
                />
            </div>
        </div>
    );
};
export default ConsoleHeader;