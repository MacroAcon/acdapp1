{ pkgs }: {
    deps = [
        pkgs.nodejs-18_x
        pkgs.python39
        pkgs.python39Packages.pip
        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
    ];
} 