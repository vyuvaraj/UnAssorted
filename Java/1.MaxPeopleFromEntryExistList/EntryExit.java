import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * This piece of code expects the following inputs
 * 
 * 1 5 1 10 3 7 5 8 3 8 5 10
 *
 *
 * Input:1 (1) determines the number of test cases or events Input:2 (5)
 * determines the number of entry, exit records that needs to be processed
 * Input:3 to Input:8 presents the entry and exit times.
 *
 * This program returns the Maximum number of persons available at any point of
 * time.
 * 
 * The result for the above input is 5. Maximum of 5 people were at say 5 & 6
 * 
 * @author Yuvaraj V
 */
public class EntryExit {

	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		int tCases = scanner.nextInt();
		int curMaxCnt = 0;
		for (int i = 0; i < tCases; i++) {
			Map<Integer, Integer> globalMap = new HashMap<Integer, Integer>();
			int lines = scanner.nextInt();
			for (int j = 0; j < lines; j++) {
				int start = scanner.nextInt();
				int end = scanner.nextInt();
				for (int k = start; k <= end; k++) {
					Integer count = globalMap.get(k);
					if (count == null) {
						count = 0;
					}
					count++;
					globalMap.put(k, count);
					if (count > curMaxCnt) {
						curMaxCnt = count;
					}
				}
			}
			System.out.println(globalMap);
			System.out.println("Max is " + curMaxCnt);
		}

	}
}
