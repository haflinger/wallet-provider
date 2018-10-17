import React, { Component } from 'react';
import WalletProvider, { Consumer as WalletConsumer } from './WalletProvider';
class App extends Component {
  render() {
    return (
      <div className="App">
        <WalletProvider>
          <WalletConsumer>
            {({ wallet, login, refresh, sign }) => (
              <div>
                <div>{wallet.loggedIn ? 'Connected': 'Disconnected' }</div>
                { wallet.address && <div>{wallet.address}</div>}
                { wallet.network && <div>{wallet.network}</div>}
                { wallet.error && <div>{wallet.error}</div>}
                <div><button onClick={() => login()}>Connect Wallet</button></div>
                <div><button onClick={() => refresh()}>Refresh Wallet</button></div>
                <div><button onClick={() => sign('message')}>Sign Wallet</button></div>
              </div>
            )}
          </WalletConsumer>
        </WalletProvider>
      </div>
    );
  }
}

export default App;
