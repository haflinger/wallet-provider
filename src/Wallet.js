// @flow
class Wallet {
    
    web3 : Web3;

    async ready() {

        if (this.web3 === undefined) {
            throw new Error('MM not ready')
        }

        return Boolean(await this.web3.eth.getCoinbase());
    }


    async login() {
        const { default: Web3 } = await import('web3');
        let provider;

        try {
            provider = window.web3.currentProvider;
        } catch(e) {
            throw e;
        }

        if(!provider) {
            throw new Error('MM not available');
        }

        this.web3 = new Web3(provider);

        return await this.ready(); 
    }

    async logout() {
        // TODO
    }

    getAddress() {
        return this.web3.eth.getAccounts().then(([account]) => account);
    }

    getAddressIndex() {
        return 0;
    }

    async sendTransaction({ nonce, from, to, value = '0', gasPrice = '0.1', gasLimit = '210000', data }: RawTx): Promise<Object> {

        if (!(await this.ready())) {
          await this.login();
        }
    
        return new Promise((resolve, reject) => this.web3.eth.sendTransaction({
          from,
          to,
          gasPrice: this.web3.utils.toWei(gasPrice, 'gwei'),
          gasLimit,
          value: `${value}`,
          data,
        }, (err, res) => {
          if (err) {
            const regex = /: Error:\s(.*)./;
            let match
            if ((match = regex.exec(err)) !== null) {
              reject(match[1]);
            } else {
              reject('Failed to validate the transaction');
            }
          }
    
          resolve({ transactionHash: res });
        }));
      }
    

    async sign({ message, from } : { message: string, from: string}): Promise<string> {

        if (!(await this.ready())) {
            await this.login();
        }

        const emailHex = this.web3.utils.toHex(message);

        const { result: signature } = await new Promise((resolve, reject) => this.web3.currentProvider.sendAsync({
            method: 'personal_sign',
            params: [emailHex, from],
            from,
          }, (err, result) => {
      
            if (err) {
              reject(err);
            }
      
            resolve(result);
        }));

        try {
            const txSender = await this.web3.eth.personal.ecRecover(emailHex, signature);
    
            if (txSender !== from.toLowerCase()) {
              throw new Error(`Sender address ${txSender} does not match expected address ${from}`);
            }

            return signature;
        } catch(e) {
            throw e;
        }
    }

    async getNetwork() {

        // If wallet not ready try to login
        if(!await this.ready()) {
            await this.login();
        }

        // Return network id
        return this.web3.eth.net.getId();
    }


}

export default Wallet;