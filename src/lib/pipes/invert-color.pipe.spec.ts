import { HubBoardInvertColorPipe } from './invert-color.pipe';

describe('HubBoardInvertColorPipe', () => {
	let pipe: HubBoardInvertColorPipe;

	beforeEach(() => {
		pipe = new HubBoardInvertColorPipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return black for empty or null input', () => {
		expect(pipe.transform('', false)).toBe('#000000');
		expect(pipe.transform(null as any, false)).toBe('#000000');
		expect(pipe.transform(undefined as any, false)).toBe('#000000');
	});

	it('should invert white to black', () => {
		expect(pipe.transform('#ffffff', false)).toBe('#000000');
		expect(pipe.transform('#FFFFFF', false)).toBe('#000000');
		expect(pipe.transform('ffffff', false)).toBe('#000000');
	});

	it('should invert black to white', () => {
		expect(pipe.transform('#000000', false)).toBe('#ffffff');
		expect(pipe.transform('000000', false)).toBe('#ffffff');
	});

	it('should handle 3-digit hex colors', () => {
		expect(pipe.transform('#fff', false)).toBe('#000000');
		expect(pipe.transform('#000', false)).toBe('#ffffff');
		expect(pipe.transform('f00', false)).toBe('#00ffff');
	});

	it('should return black or white for bw mode', () => {
		expect(pipe.transform('#ffffff', true)).toBe('#000000'); // White -> Black
		expect(pipe.transform('#000000', true)).toBe('#FFFFFF'); // Black -> White
		expect(pipe.transform('#ff0000', true)).toBe('#FFFFFF'); // Red -> White (bright red)
		expect(pipe.transform('#800000', true)).toBe('#FFFFFF'); // Dark red -> White
		expect(pipe.transform('#008000', true)).toBe('#FFFFFF'); // Green -> White (standard green is bright)
	});

	it('should throw error for invalid hex colors', () => {
		expect(() => pipe.transform('#12345', false)).toThrow();
		expect(() => pipe.transform('#1234567', false)).toThrow();
		expect(() => pipe.transform('invalid', false)).toThrow();
	});
});
