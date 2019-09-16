import { app } from 'electron';
import { readJson, writeJson } from 'fs-extra';
import * as path from 'path';
import { from, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

interface Storage {
  [key: string]: any;
}

export class StorageService {
  private readonly filename = path.resolve(app.getPath('userData'), 'storage.json');
  private storage: Storage | null = null;

  private readonly saveStream = new Subject();
  private readonly saveSubscription: Subscription;
  private readonly destroyed = new Subject();

  constructor() {
    this.saveSubscription = this.saveStream.asObservable().pipe(
      debounceTime(50),
      takeUntil(this.destroyed),
      switchMap(() => from(this._save())),
    ).subscribe();
  }

  async initialize() {
    try {
      this.storage = await readJson(this.filename, { throws: true });
    } catch {
      this.storage = {};
      await this._save();
    }
  }

  destroy() {
    this.destroyed.next();
    this.destroyed.complete();

    this.saveSubscription.unsubscribe();
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  get<T>(key: string) {
    if (this.storage !== null) {
      return this.storage[key] || null;
    }
    return null;
  }

  set<T>(key: string, data: T) {
    if (this.storage !== null) {
      this.storage[key] = data;
    }
    return this;
  }

  save() {
    this.saveStream.next();
  }

  private async _save() {
    if (this.storage !== null) {
      await writeJson(this.filename, this.storage, { spaces: 2 });
    }
  }
}
