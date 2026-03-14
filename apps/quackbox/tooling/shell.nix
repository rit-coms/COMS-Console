{
  perSystem = { pkgs, self', ...}: {
    devShells.quackbox = pkgs.mkShell {
      packages = with pkgs; [
        # node
        nodejs
        bun

        # rust
        cargo
        rustc
        rustfmt
        clippy
        rust-analyzer

        # tauri
        cargo-tauri
      ];
      env.RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
    };
    
  };
}
