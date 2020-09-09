# Maintainer: Gerome Matilla <gerome.matilla07@gmail.com | gmail>

pkgname=tde-greeter
pkgver=1.0.0
pkgrel=1
pkgdesc="a sleek, modern and lightdm theme for TDE"
arch=('any')
url="https://github.com/ODEX-TOS/lightdm-tde"
license=('GPL3')
depends=('lightdm' 'lightdm-webkit2-greeter>=2.2.5-2')
install=
changelog=
source=("lightdm::git+https://github.com/ODEX-TOS/lightdm-tde.git")
md5sums=('SKIP')

package() {
	cd "$pkgdir"
	mkdir -p usr/share/lightdm-webkit/themes/
	rm -rf usr/share/lightdm-webkit/themes/lightdm-webkit2-theme-glorious
	cd usr/share/lightdm-webkit/themes/
	cp --recursive "$srcdir/lightdm" "tde"
}
