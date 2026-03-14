{
  perSystem = { pkgs, self', ... }: {
    devShells.default = pkgs.mkShell {
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

        # 
      ];
      env.RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
    };
  };
}
