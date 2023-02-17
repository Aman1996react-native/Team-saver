import React from 'react';

export const ThemeContext = React.createContext({ headerColor: '#000000', buttonColor: '#000000' });

export class ThemeProvider extends React.Component {

    state = {
        headerColor: '#000000',
        buttonColor: '#000000'

    };

    render() {
        return (
            <ThemeContext.Provider value={{
                data: this.state, update: (color) => {
                    this.setState({ headerColor: color, buttonColor: 'blue' });
                }
            }}>
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}