@echo off

set PageFileSizeBytesHex=2048

reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v PagingFiles /t REG_MULTI_SZ /d "C:\pagefile.sys %PageFileSizeBytesHex% 0" /f

shutdown /r /f /t 0