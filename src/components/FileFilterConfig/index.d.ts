interface ConfigBase {
  enable: boolean,
}

interface ConfigFileSize extends ConfigBase {
  min: number
  max: number
}
interface ConfigFileType extends ConfigBase {
  types: string[]
}
interface ConfigMtime extends ConfigBase {
  range: string[]
}
interface ConfigEntryType extends ConfigBase {
  types: string[]
}

export type IConfig = {
  fileSize: ConfigFileSize,
  fileType: ConfigFileType,
  mtime: ConfigMtime
  entryType: ConfigEntryType
}
