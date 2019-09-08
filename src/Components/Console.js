import React from 'react';
import {Route, Redirect, Switch} from "react-router-dom";
import client from '../js/client';
import helper from '../js/helpers'
import ConsoleBody from './ConsoleBody'
import ConsoleHeader from './ConsoleHeader'

import 'codemirror/mode/python/python';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import '../Assets/css/console.css';
import 'codemirror/theme/3024-day.css'
import 'codemirror/theme/3024-night.css'


class Console extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            title: "Untitled",
            editors: [{text: "", mode: "python", output: "", show: false}],
            errors: "",
        }
    }

    login() {
        client.login((data) => {
            console.log(data);
            try {
                let id = data.data.getKernelInstance.id;
                this.setState({
                    token: id,
                });
            } catch (e) {
                this.setState({
                    errors: data.errors.message,
                })
            }
        });

    }

    newDocument() {
        this.setState({
            editors: [{text: "", mode: "python", output: "", show: false}],
        });
    }

    upload(text) {
        try {
            let json = JSON.parse(text);
            if (json.file !== "vebpynb") {
                this.setState({
                    errors: "JSON File Format Not Supported",
                });
                return;
            }
            console.log(json);
            this.setState(json);
        } catch (e) {
            this.setState({
                errors: "File not Supported",
            });
        }
    }

    download() {
        let {token, errors, ...json} = this.state;
        json.file = "vebpynb";
        helper.exportToJsonFile(json, this.state.title);
    }

    logout() {
        client.logout((data) => {
            console.log(data.data.closeKernelInstance.output);
            this.setState({
                token: null,
                editors: [{text: "", mode: "python", output: "", show: false}],
            })
        }, {id: this.state.token});
    }

    titleUpdate(newTitle) {
        this.setState({
            title: newTitle
        });
    }

    changeMode(mode, index) {
        let editors = this.state.editors.slice();
        editors[index].mode = mode;
        this.setState({
            editors: editors
        })
    }

    changeText(text, index) {
        let editors = this.state.editors.slice();
        editors[index].text = text;
        this.setState({
            editors: editors
        })
    }

    removeEditor(index) {
        let editors = this.state.editors;
        if (editors.length <= 1) {
            editors = [{text: "", mode: "python", output: ""}]
        } else {
            editors = [...editors.slice(0, index), ...editors.slice(index + 1, editors.length)];
        }
        this.setState({
            editors: editors
        });
    }

    addEditor(index) {
        let editors = this.state.editors;
        editors = [...editors.slice(0, index + 1), {
            text: "",
            mode: "python",
            output: "",
        }, ...editors.slice(index + 1, editors.length)];
        this.setState({
            editors: editors
        });
    }

    execute(index) {
        let editors = this.state.editors.slice();
        let code = editors[index].text;
        // console.log(code);
        client.execute((data) => {
            console.log(data);
            try {
                editors[index].output = data.data.execute.python.result.output + data.data.execute.python.result.error;
                this.setState({
                    editors: editors,
                });
            } catch (e) {
                this.setState({
                    errors: data.errors,
                })
            }
        }, {id: this.state.token, code: code});
    }

    currentEditor(index) {
        let editors = this.state.editors.slice();
        for (let i = 0; i < editors.length; i++) {
            editors[i].show = false;
        }
        if (index !== -1) {
            editors[index].show = true;
        }
        this.setState({
            editors: editors,
        })
    }

    render() {
        return (
            <div className="console">
                <Switch>
                    <Route exact path="/" render={() => {
                        return (this.state.token ? <Redirect to="/vebpy"/> : <Redirect to="/login"/>)
                    }}/>
                    <PrivateRoute path="/vebpy" elsePath="/login" token={this.state.token} render={() => {
                        return (
                            <div>
                                <ConsoleHeader
                                    title={this.state.title}
                                    onTitleUpdate={(newTitle) => {
                                        this.titleUpdate(newTitle)
                                    }}
                                    onNewDocumentClick={() => {
                                        this.newDocument()
                                    }}
                                    onUploadClick={(text) => {
                                        this.upload(text);
                                    }}
                                    onDownloadClick={() => {
                                        this.download()
                                    }}
                                    onLogoutClick={() => {
                                        this.logout()
                                    }}
                                />
                                <ConsoleBody
                                    editors={this.state.editors}
                                    onChangeMode={(mode, index) => {
                                        this.changeMode(mode, index)
                                    }}
                                    onChangeText={(text, index) => {
                                        this.changeText(text, index)
                                    }}
                                    onRemoveEditor={(index) => {
                                        this.removeEditor(index)
                                    }}
                                    onAddEditor={(index) => {
                                        this.addEditor(index)
                                    }}
                                    onPlayClick={(index) => {
                                        this.execute(index);
                                    }}
                                    onEditorClick={(index) => {
                                        this.currentEditor(index);
                                    }}
                                />
                            </div>
                        );
                    }}/>
                    <PrivateRoute path="/login" token={!this.state.token} elsePath="/vebpy" render={() => {
                        return <Login onLogin={() => {
                            this.login()
                        }}/>
                    }}/>
                </Switch>
            </div>
        );
    }
}

class Login extends React.Component {
    render() {
        return (
            <div className="login">
                Please generate a token to access VebPy: &nbsp;
                <button onClick={this.props.onLogin}>Login</button>
            </div>
        );
    }
}

class PrivateRoute extends React.Component {
    render() {
        return (
            <Route exact={this.props.exact} path={this.props.path} render={() => {
                if (this.props.token) {
                    return this.props.render()
                }
                return <Redirect to={this.props.elsePath}/>
            }}/>
        );
    }
}

export default Console;
