import { expect, it } from 'vitest';
import { zerlege } from './begriffe.js';

const begriffe = (text) => zerlege(text).filter((teil) => teil.erklaerung).map((teil) => teil.text);

it('lässt Text ohne Fachbegriff in einem Stück', () => {
  expect(zerlege('bestimmen den Zeitaufwand.')).toEqual([{ text: 'bestimmen den Zeitaufwand.' }]);
});

it('setzt die Teile wieder zum ganzen Text zusammen', () => {
  const text = 'erstellen ein Moodboard und ein Storyboard.';
  const teile = zerlege(text);
  expect(teile.map((teil) => teil.text).join('')).toBe(text);
  expect(teile[1]).toEqual({
    text: 'Moodboard',
    erklaerung: expect.stringContaining('Collage aus Bildern'),
  });
});

it('erkennt gebeugte Formen', () => {
  expect(begriffe('Wirkung von Moodboards in Leitsystemen und Briefings')).toEqual([
    'Moodboards',
    'Leitsystemen',
    'Briefings',
  ]);
});

it('erkennt Begriffe aus zwei Wörtern, auch zusammengeschrieben', () => {
  expect(begriffe('Corporate Identity und Corporate Design, Animation und Motiondesign')).toEqual([
    'Corporate Identity',
    'Corporate Design',
    'Motiondesign',
  ]);
});

it('lässt Zusammensetzungen und längere Wörter unberührt', () => {
  expect(begriffe('Layoutkonzepte, Portfolioformen und Schullayout')).toEqual([]);
});

it('ordnet Debriefing und Selbstmarketing dem eigenen Begriff zu', () => {
  const teile = zerlege('Debriefing und Selbstmarketing').filter((teil) => teil.erklaerung);
  expect(teile[0].erklaerung).toContain('Nachbereitung');
  expect(teile[1].erklaerung).toContain('eigene Person');
});
