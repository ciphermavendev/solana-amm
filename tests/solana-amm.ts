import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaAmm } from "../target/types/solana_amm";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";

describe("solana-amm", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaAmm as Program<SolanaAmm>;

  let tokenAMint: anchor.web3.PublicKey;
  let tokenBMint: anchor.web3.PublicKey;
  let userTokenAAccount: anchor.web3.PublicKey;
  let userTokenBAccount: anchor.web3.PublicKey;
  let poolTokenAAccount: anchor.web3.PublicKey;
  let poolTokenBAccount: anchor.web3.PublicKey;
  let pool: anchor.web3.PublicKey;

  it("Initializes the AMM", async () => {
    // Create token mints
    tokenAMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey,
      null,
      9
    );

    tokenBMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey,
      null,
      9
    );

    // Create user token accounts
    userTokenAAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      tokenAMint,
      provider.wallet.publicKey
    );

    userTokenBAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      tokenBMint,
      provider.wallet.publicKey
    );

    // Create pool token accounts
    poolTokenAAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      tokenAMint,
      provider.wallet.publicKey
    );

    poolTokenBAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      tokenBMint,
      provider.wallet.publicKey
    );

    // Initialize pool
    const [poolPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pool")],
      program.programId
    );
    pool = poolPda;

    await program.methods
      .initialize(new anchor.BN(30)) // 0.3% fee
      .accounts({
        pool: pool,
        tokenAMint: tokenAMint,
        tokenBMint: tokenBMint,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
  });

  it("Deposits tokens", async () => {
    // Mint some tokens to user
    await mintTo(
      provider.connection,
      provider.wallet.payer,
      tokenAMint,
      userTokenAAccount,
      provider.wallet.publicKey,
      1000000000
    );

    await mintTo(
      provider.connection,
      provider.wallet.payer,
      tokenBMint,
      userTokenBAccount,
      provider.wallet.publicKey,
      1000000000
    );

    // Deposit tokens
    await program.methods
      .deposit(new anchor.BN(100000000), new anchor.BN(100000000))
      .accounts({
        pool: pool,
        userTokenA: userTokenAAccount,
        userTokenB: userTokenBAccount,
        poolTokenA: poolTokenAAccount,
        poolTokenB: poolTokenBAccount,
        user: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  });

  it("Swaps tokens", async () => {
    await program.methods
      .swap(new anchor.BN(10000000))
      .accounts({
        pool: pool,
        userTokenIn: userTokenAAccount,
        userTokenOut: userTokenBAccount,
        poolTokenIn: poolTokenAAccount,
        poolTokenOut: poolTokenBAccount,
        user: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  });
});