import { getTimestampedFilename } from './FileUtils';

const timeStampRegex: RegExp = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]-[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9]Z/;
const timeStampLength: number = 24;

test('getTimestampedFilename with empty prefix and extension only returns timestamp', () => {
  const filename = getTimestampedFilename();
  expect(timeStampRegex.test(filename)).toEqual(true);
  expect(filename.length).toEqual(timeStampLength);
});

test('getTimestampedFilename called multiple times returns same timestamp', () => {
  jest.useFakeTimers();
  const filename1 = getTimestampedFilename();
  setTimeout(() => {
    const filename2 = getTimestampedFilename();
    expect(filename2).toEqual(filename1);
  }, 2000);
  jest.runAllTimers();
});

test('getTimestampedFileName called with prefix only returns correct values', () => {
  const prefix = 'test-prefix';
  const totalExpectedLength = timeStampLength + prefix.length;
  const filename = getTimestampedFilename(prefix);
  expect(timeStampRegex.test(filename)).toEqual(true);
  expect(filename.startsWith(prefix)).toEqual(true);
  expect(filename.endsWith('Z')).toEqual(true);
  expect(filename.length).toEqual(totalExpectedLength);
});

test('getTimestampedFileName called with prefix and extension returns correct values', () => {
  const prefix = 'test-prefix';
  const extension = 'test-extension';
  const totalExpectedLength =
    timeStampLength + prefix.length + extension.length;
  const filename = getTimestampedFilename(prefix, extension);
  expect(timeStampRegex.test(filename)).toEqual(true);
  expect(filename.startsWith(prefix)).toEqual(true);
  expect(filename.endsWith(extension)).toEqual(true);
  expect(filename.length).toEqual(totalExpectedLength);
});
