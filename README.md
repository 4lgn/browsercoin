# browsercoin 💸💻

Browsercoin is an experimental prototype of a blockchain-based crypto currency running entirely in a browser using simple PoW.

The front-end is implemented in React with TypeScript web workers to handle mining to avoid hanging the web UI, along with a peer-to-peer communication through WebRTC and a peer broker server in Express.

![Illustration picture](https://github.com/4lgn/browsercoin/raw/master/illustration.png)

![Second illustration picture](https://github.com/4lgn/browsercoin/raw/master/illustration_2.png)

## WIP Disclaimer

This was mostly a smaller weekend project I made because I wondered how possible/difficult it would be to actually implement. Because of this, the UI and most of the codebase is still in a very early state, and definitely nothing to be proud of - it is filled with commented-out code and probably very easy to break. This should mostly serve as an idea of how one might implement such an application, and maybe use it for some educational content about how blockchains and the initial simple concepts relayed in the Bitcoin whitepaper could be implemented in practice.

## Problems

A blockchain-based crypto currency running entirely in a browser imposes a few interesting problems to solve:

- Controlling start/stop without hanging UI when calculating PoW for a block is non-trivial when NodeJS is single-threaded.
- Peer-to-peer communication through the browser with WebRTC

## License

Copyright (c) 2021 Alexander G. Nielsen. See [LICENSE](https://github.com/4lgn/browsercoin/blob/master/LICENSE) for details.