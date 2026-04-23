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
        pkg-config
        at-spi2-atk
        atkmm
        cairo
        gdk-pixbuf
        glib
        glib-networking
        gtk3
        harfbuzz
        librsvg
        libsoup_3
        pango
        webkitgtk_4_1
        openssl
      ];
      env.RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
    };
  };
}
