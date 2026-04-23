{
  perSystem = { pkgs, self', ...}: {
    devShells.quackbox = pkgs.mkShell {
      packages = with pkgs; [
        # node
        nodejs
        bun

        # rust
        cargo
        clippy
        # rust-src
        rustc
        rustfmt
        rust-analyzer

        # tauri
        cargo-tauri

        # native build deps
        pkg-config
        gobject-introspection
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
      env.GIO_MODULE_DIR = "${pkgs.glib-networking}/lib/gio/modules/";
    };
    
  };
}
