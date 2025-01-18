
# 遊戲場系統前端

使用遊戲卡裡的代碼玩遊戲，遊戲獲勝後即可贏得票券~

1. 進入首頁後可選擇目前的角色，只有系統管理員可設定遊戲及獎項，角色default為一般使用者。
2. 遊戲設定:
	- 輸入遊戲名稱以及多少代碼才可玩此遊戲，若遊戲獲勝可贏得多少票券。
	- 可新增、編輯及刪除遊戲。
3. 獎品設定:
	- 輸入獎項名稱、需要多少票券才可兌換，以及獎項剩餘數量。
	- 可新增、編輯及刪除獎品。
4. 新增遊戲卡、儲值
	- 於此處新增遊戲卡代碼，可於輸入框中輸入指定的代碼數。
	- 可新增及刪除遊戲卡
5. 轉換代碼、票券
	- 兩張卡片代碼及票券的轉換，輸入來源卡片及目標卡票後，接著輸入轉換的數量，並選擇需轉換代碼或票券。
6. 查看卡片餘額
	- 輸入卡號後點按查看卡片餘額即可查詢卡片的代碼及票券。
7. 選擇遊戲
	- 必須要擁有足夠的代碼才可玩該遊戲。
	- 若有足夠的代碼可玩遊戲，接著需選擇是否贏得遊戲。是-> 扣除代碼+獲得票券, 否-> 只扣除代碼。
8. 兌換獎品
	- 使用卡片裡的票券兌換獎品。
	- 必須有足夠的票券才可兌換該獎品。


# Tech Stack: 
React+Vite, Javascript, HTML, CSS

DEMO: https://arcade-7684f.web.app/

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




