import React, { Component } from 'react';
import Wallet from './Wallet';

// Create context;
const { Consumer, Provider } = React.createContext({});

class WalletProvider extends Component {

    wallet = new Wallet();

    state = {
        loggedIn : false,
    };

    async login() {
        try {

            // We try to connect the user
            const loggedIn = await this.wallet.login();

            // Set the state
            loggedIn ? this.setState((state) => ({ loggedIn })) : 
            this.setState((state) => ({ error: 'Unable to login', loggedIn }));

            // If loggedIn set state address / addressIndex
            if (loggedIn) {
                const address = await this.wallet.getAddress()
                const addressIndex = await this.wallet.getAddressIndex();
                const network = await this.wallet.getNetwork();
                this.setState((state) => ({ address, addressIndex, network, error: null }));
            }

        } catch(e) {
            this.setState((state) => ({ error: e.message, loggedIn: false }));
        }   
    }

    async refresh() {
        try {
            const network = await this.getNetwork();
            this.setState((state) => ({ network }));
        } catch(e) {
            this.setState((state) => ({ error: e.message, loggedIn: false }))
        }
    }

    async sign(message) {
        try {
            await this.wallet.sign({message, from: this.state.address});
        } catch(e) {
            this.setState((state) => ({ error: e.message }));
        }
    }

    async getNetwork() {
        try {
            const network = await this.wallet.getNetwork();
            return network;
        } catch(e) {
            throw e;
        }
    }

    render() {
        const value = { 
            wallet : this.state,
            login : () => this.login(),
            network: () => this.getNetwork(),
            refresh: () => this.refresh(),
            sign: (message) => this.sign(message),
        };

        return <Provider value={value}>{this.props.children}</Provider>
    }
}

export { Consumer };

export default WalletProvider;
