package constants

import "github.com/Suplice/Filestorix/internal/dto"

const Hour int = 3600
const Day int = Hour * 24
const MaxFileSize = 10 << 20 // 10MB

var BaseSettings = []dto.UserSetting{
	{
		SettingKey: "theme",
		SettingValue: "system",
	},
	{
		SettingKey: "openSearchBox",
		SettingValue: "j",
	},
}