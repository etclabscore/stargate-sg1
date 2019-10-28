function ApproveTx(req) {
    if (req.transaction.from.toLowerCase() == "0xf215e98b4f0c749fe9b78d0d4fa97ac7c9a4fe11") {
        return "Approve";
    }
}
// https://github.com/ethereum/go-ethereum/blob/master/cmd/clef/rules.md