import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a hexadecimal color string into its inverted counterpart, offering both
 * high-contrast black/white and full-spectrum inversion modes.
 *
 * The name is qualified with the library because `ng-hub-ui-forms` publishes a
 * `HubInvertColorPipe` of its own; the two could not be imported into the same file
 * otherwise. That one resolves any CSS colour and never throws, so prefer it when the
 * application already depends on `ng-hub-ui-forms`.
 *
 * @publicApi
 */
@Pipe({
	name: 'hubBoardInvertColor',
	standalone: true
})
export class HubBoardInvertColorPipe implements PipeTransform {
	/**
	 * Inverts a HEX color value.
	 *
	 * @param hex - Color expressed as a 3- or 6-digit HEX string with or without a hash prefix.
	 * @param bw - When `true`, returns either black or white based on perceived brightness to maximise contrast.
	 * @returns The inverted color represented as a 6-digit HEX string (always prefixed with `#`).
	 * @throws Error if the provided value cannot be parsed as a valid HEX color.
	 */
	transform(hex: string, bw: boolean): string {
		if (!hex) {
			return '#000000';
		}

		let normalizedHex = hex;
		if (normalizedHex.indexOf('#') === 0) {
			normalizedHex = normalizedHex.slice(1);
		}

		if (normalizedHex.length === 3) {
			// Convert shorthand notation (e.g., #abc) to full length (#aabbcc)
			normalizedHex =
				normalizedHex[0] + normalizedHex[0] + normalizedHex[1] + normalizedHex[1] + normalizedHex[2] + normalizedHex[2];
		}

		if (normalizedHex.length !== 6) {
			throw new Error('Invalid HEX color.');
		}

		const r = parseInt(normalizedHex.slice(0, 2), 16);
		const g = parseInt(normalizedHex.slice(2, 4), 16);
		const b = parseInt(normalizedHex.slice(4, 6), 16);

		if (bw) {
			// http://stackoverflow.com/a/3943023/112731
			return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
		}

		const invertedR = (255 - r).toString(16).padStart(2, '0');
		const invertedG = (255 - g).toString(16).padStart(2, '0');
		const invertedB = (255 - b).toString(16).padStart(2, '0');

		return `#${invertedR}${invertedG}${invertedB}`;
	}
}

/**
 * @deprecated Renamed to `HubBoardInvertColorPipe` (template name `hubBoardInvertColor`),
 * and removed under this name in **23.0.0**. `invertColor` is an unprefixed name in the
 * application's own template namespace, which is not the library's to take. Behaviour is
 * unchanged: this subclass exists only so templates written against the old name keep
 * rendering until the removal.
 */
@Pipe({
	name: 'invertColor',
	standalone: true
})
export class InvertColorPipe extends HubBoardInvertColorPipe {}
