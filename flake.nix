{
  description = "The Quack Ecosystem";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    import-tree.url = "github:vic/import-tree";
  };

  outputs = {self, ...} @ inputs: inputs.flake-parts.lib.mkFlake { inherit inputs; } (
    let
      tree = inputs.import-tree [ ./apps ./libs ./tooling ];
      lib  = inputs.pkgs.lib;
    in
    {
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ];
      imports = tree.imports;
  } );
}
