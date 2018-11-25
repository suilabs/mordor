let SessionModel = require('./Session');

let mockUuidV4;
let mockSave;
let mockFind;
jest.mock('uuid/v4', () => () => mockUuidV4());
jest.mock('mongoose', () => ({
  model: (_) => class {
    constructor(obj) {
      this.obj = obj
    }

    static find(criteria) {
      mockFind(criteria);
      return [{}];
    }

    toObject() { return this.obj }

    save(...args) {
      mockSave(...args)
    }
  },

  Schema: class Schema {}
}));

describe('Session', () => {
  beforeAll(() => {
    mockUuidV4 = jest.fn().mockReturnValue('uuid');
    mockSave = jest.fn();
  });

  afterEach(() => {
    mockUuidV4.mockClear();
    mockSave.mockClear();
  });

  it('should create a new session', () => {
    const session = new SessionModel({});

    expect(session).not.toBe(null);
  });

  it('should assign a uuid token to the new session', () => {
    const session = new SessionModel({});

    expect(session.getToken()).toBe('uuid');
    expect(mockUuidV4).toHaveBeenCalledTimes(1);
  });

  it('should assign a ttl to the new session', () => {
    Date.now = jest.fn().mockReturnValue(new Date('2018-01-01T00:00:00Z'));
    const session = new SessionModel({
      ttl: 5,
    });

    expect(session.getTTL().toISOString()).toBe('2018-01-01T00:05:00.000Z');
  });

  it('should save the new created session', () => {
    const session = new SessionModel({
      ttl: 5,
      ip: 'ip',
      browser: 'browser'
    });

    session.store();
    expect(mockSave).toHaveBeenCalled();
  });

  it('should restore session by calling find with criteria', () => {
    mockFind = jest.fn().mockReturnValue({});
    const session = SessionModel.restore({
      ip: 'ip',
      browser: 'browser',
      token: 'token'
    });

    expect(mockFind).toHaveBeenCalledWith({
      ip: 'ip',
      browser: 'browser',
      current_token: 'token',
    })
  })
});