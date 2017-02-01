import { UniversalCliTestPage } from './app.po';

describe('universal-cli-test App', function() {
  let page: UniversalCliTestPage;

  beforeEach(() => {
    page = new UniversalCliTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
