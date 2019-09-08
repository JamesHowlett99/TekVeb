import React from "react";

export default class Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editing: false,
        }
    }

    componentDidMount() {
        this.setState({
            title: this.props.title,
        });
    }

    handleTitleClick() {
        this.setState({
            editing: true,
        })
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value,
        })
    }

    handleTitleSubmit() {
        this.setState({
            title: this.state.title !== "" ? this.state.title : this.props.title,
            editing: false,
        });
        this.props.onTitleUpdate(this.state.title !== "" ? this.state.title : this.props.title);
    }

    render() {
        return (
            <div className="title-bar">
                {
                    !this.state.editing ?
                        <div className="title" onClick={() => {
                            this.handleTitleClick()
                        }}>
                            {this.state.title}
                        </div> :
                        <div className="input">
                            <form onSubmit={() => {
                                this.handleTitleSubmit()
                            }}>
                                <input type="text" value={this.state.title} onChange={(e) => {
                                    this.handleTitleChange(e)
                                }}/>
                                <input type="submit"/>
                            </form>
                        </div>
                }
            </div>
        );
    }
}
